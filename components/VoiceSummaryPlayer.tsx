"use client";
import { useMemo } from "react";
import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { useRef, useState } from "react";

export function VoiceSummaryPlayer({ audio, onGenerate, loading }: { audio: string | null; onGenerate: () => void; loading: boolean }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const source = useMemo(() => audio ? `data:${audio.split(",")[0].split(":")[1]?.split(";")[0] || "audio/mpeg"};base64,${audio.split(",").pop()}` : "", [audio]);
  return <div className="voice-player">{audio ? <><audio ref={ref} src={source} onEnded={() => setPlaying(false)} /><button className="play-button" onClick={() => { if (playing) ref.current?.pause(); else void ref.current?.play(); setPlaying(!playing); }} aria-label={playing ? "Pause voice summary" : "Play voice summary"}>{playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button><div className="voice-info"><strong>Visit summary</strong><span>Audio summary · Ready to listen</span></div><div className="wave-bars" aria-hidden="true">{Array.from({ length: 25 }, (_, i) => <i key={i} style={{ height: `${12 + (i * 17 % 23)}px` }} />)}</div><Volume2 className="volume-icon" size={18} /></> : <><span className="voice-mark"><Volume2 size={18} /></span><div className="voice-info"><strong>A spoken version of your note</strong><span>Listen or share with the patient</span></div><button className="summary-button" onClick={onGenerate} disabled={loading}>{loading ? <RotateCcw size={15} className="spin" /> : <Play size={15} />} {loading ? "Creating…" : "Create audio"}</button></>}</div>;
}
