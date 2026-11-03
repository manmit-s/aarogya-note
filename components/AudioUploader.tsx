"use client";

import { useRef, useState } from "react";
import { Check, FileAudio, RotateCcw, Upload } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  file: File | null;
  onFile: (file: File) => void;
  onClear: () => void;
  onError: (message: string) => void;
  disabled: boolean;
};

const accepted = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/webm",
  "video/webm",
];
const extensions = ["mp3", "wav", "m4a", "webm"];

export function AudioUploader({ file, onFile, onClear, onError, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const select = (picked?: File) => {
    if (!picked || disabled) return;
    const ext = picked.name.split(".").pop()?.toLowerCase();
    if (!accepted.includes(picked.type) && !extensions.includes(ext || "")) {
      onError("Choose an MP3, WAV, M4A, or WebM audio file.");
      return;
    }
    if (picked.size > 30 * 1024 * 1024) {
      onError("Audio files must be 30 MB or smaller.");
      return;
    }
    onError("");
    onFile(picked);
  };

  return (
    <motion.div
      layout
      className={`upload-zone ${dragging ? "drag-active" : ""} ${file ? "has-file" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        select(e.dataTransfer.files[0]);
      }}
    >
      <input
        ref={input}
        type="file"
        accept=".mp3,.wav,.m4a,.webm,audio/*"
        className="hidden"
        onChange={(e) => {
          select(e.target.files?.[0]);
          e.currentTarget.value = "";
        }}
      />
      {file ? (
        <div className="picked-cartridge">
          <span className="file-icon">
            <FileAudio size={20} strokeWidth={1.8} />
          </span>
          <div className="file-copy">
            <strong title={file.name}>{file.name}</strong>
            <span>{(file.size / (1024 * 1024)).toFixed(1)} MB · Ready to transcribe</span>
          </div>
          <span className="ready-badge">
            <Check size={13} strokeWidth={2.4} />
            <span>Ready</span>
          </span>
          <button
            type="button"
            className="icon-button remove-button"
            disabled={disabled}
            aria-label="Remove audio recording"
            title="Choose a different recording"
            onClick={onClear}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="drop-target"
          disabled={disabled}
          onClick={() => input.current?.click()}
        >
          <span className="upload-icon">
            <Upload size={19} strokeWidth={2} />
          </span>
          <span className="drop-title">
            Drop consultation recording, or <b>browse files</b>
          </span>
          <span className="drop-subtitle">
            Turn clinical conversation into an organized draft.
          </span>
        </button>
      )}
    </motion.div>
  );
}
