import base64
import io
import os
import re
import wave
from pathlib import Path

from dotenv import load_dotenv
from sarvamai import SarvamAI


ROOT = Path(__file__).resolve().parents[1]
TRANSCRIPTS_DIR = ROOT / "samples" / "transcripts"
OUTPUT_DIR = ROOT / "samples" / "tts-generations"
MODEL = "bulbul:v3"
LANGUAGE = "hi-IN"
SPEAKERS = {"Doctor": "shubh", "Patient": "priya"}
SAMPLE_RATE = 22050
PAUSE_SECONDS = 0.4


def parse_transcript(path: Path) -> list[tuple[str, str]]:
    turns = []
    for line_number, raw_line in enumerate(path.read_text(encoding="utf-8-sig").splitlines(), 1):
        line = raw_line.strip()
        if not line:
            continue
        match = re.fullmatch(r"(Doctor|Patient):\s*(.+)", line)
        if not match:
            raise ValueError(f"{path.name}:{line_number}: expected 'Doctor:' or 'Patient:' followed by text")
        turns.append((match.group(1), match.group(2).strip()))
    if not turns:
        raise ValueError(f"{path.name}: transcript is empty")
    return turns


def synthesize(client: SarvamAI, speaker: str, text: str) -> bytes:
    response = client.text_to_speech.convert(
        text=text,
        model=MODEL,
        speaker=SPEAKERS[speaker],
        language_code=LANGUAGE,
        output_audio_codec="wav",
        speech_sample_rate=SAMPLE_RATE,
    )
    if not response.audios:
        raise RuntimeError(f"Sarvam returned no audio for {speaker} turn")
    return base64.b64decode(response.audios[0])


def merge_wav_segments(segments: list[bytes], output_path: Path) -> None:
    frames = []
    audio_format = None
    for segment in segments:
        with wave.open(io.BytesIO(segment), "rb") as audio:
            current_format = (audio.getnchannels(), audio.getsampwidth(), audio.getframerate(), audio.getcomptype())
            if audio_format is None:
                audio_format = current_format
            elif current_format != audio_format:
                raise ValueError("Sarvam returned audio segments with incompatible WAV formats")
            frames.append(audio.readframes(audio.getnframes()))

    channels, sample_width, sample_rate, _ = audio_format
    silence = b"\x00" * int(sample_rate * PAUSE_SECONDS) * channels * sample_width
    with wave.open(str(output_path), "wb") as output:
        output.setnchannels(channels)
        output.setsampwidth(sample_width)
        output.setframerate(sample_rate)
        for index, segment_frames in enumerate(frames):
            if index:
                output.writeframes(silence)
            output.writeframes(segment_frames)


def main() -> None:
    load_dotenv(ROOT / "backend" / ".env")
    api_key = os.getenv("SARVAM_API_KEY")
    if not api_key:
        raise SystemExit("SARVAM_API_KEY was not found in the project .env file")
    if not TRANSCRIPTS_DIR.is_dir():
        raise SystemExit(f"Transcript folder not found: {TRANSCRIPTS_DIR}")

    transcript_files = sorted(TRANSCRIPTS_DIR.glob("*.txt"))
    if not transcript_files:
        raise SystemExit(f"No .txt transcripts found in {TRANSCRIPTS_DIR}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    client = SarvamAI(api_subscription_key=api_key)

    for transcript_path in transcript_files:
        print(f"Processing {transcript_path.name}...")
        turns = parse_transcript(transcript_path)
        segments = []
        for speaker, text in turns:
            print(f"  Generating {speaker} audio...")
            segments.append(synthesize(client, speaker, text))
        output_path = OUTPUT_DIR / f"{transcript_path.stem}.wav"
        merge_wav_segments(segments, output_path)
        print(f"  Merged conversation saved: {output_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
