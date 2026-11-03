"use client";

import { useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";

export function VoiceSummaryPlayer({
  audio,
  onGenerate,
  loading,
}: {
  audio: string | null;
  onGenerate: () => void;
  loading: boolean;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const source = useMemo(() => {
    if (!audio) return "";
    const mime = audio.split(",")[0].split(":")[1]?.split(";")[0] || "audio/mpeg";
    const b64 = audio.split(",").pop();
    return `data:${mime};base64,${b64}`;
  }, [audio]);

  const togglePlay = () => {
    if (!ref.current) return;
    if (playing) {
      ref.current.pause();
      setPlaying(false);
    } else {
      void ref.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className={`voice-player-wrap ${playing ? "is-playing" : ""}`}>
      {audio ? (
        <div className="voice-player-bar">
          <audio
            ref={ref}
            src={source}
            onEnded={() => setPlaying(false)}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
          />

          <button
            type="button"
            className="player-play-btn"
            onClick={togglePlay}
            aria-label={playing ? "Pause voice summary" : "Play voice summary"}
          >
            {playing ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" style={{ marginLeft: "2px" }} />
            )}
          </button>

          <div className="player-meta">
            <strong>Visit summary</strong>
            <span>{playing ? "Playing audio..." : "Audio summary · Ready to listen"}</span>
          </div>

          <div className="player-waves" aria-hidden="true">
            {Array.from({ length: 24 }, (_, i) => (
              <i
                key={i}
                style={{
                  height: `${10 + ((i * 17) % 22)}px`,
                  animationDelay: `${(i * 0.05).toFixed(2)}s`,
                }}
              />
            ))}
          </div>

          <div className="player-vol-icon">
            <Volume2 size={17} />
          </div>
        </div>
      ) : (
        <div className="voice-unready">
          <div className="voice-unready-info">
            <span className="unready-icon">
              <Volume2 size={16} />
            </span>
            <div>
              <strong>A listenable summary</strong>
              <span>Create an audio version for clinician or patient review</span>
            </div>
          </div>
          <button
            type="button"
            className="neu-button secondary-button"
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <RotateCcw size={14} className="spin" />
                <span>Creating…</span>
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" />
                <span>Create audio</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
