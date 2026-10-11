"use client";

import { useRef, useState, type ReactNode } from "react";
import { CloudUpload } from "lucide-react";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function FileDropzone({ accept, maxBytes, onFiles, disabled, title = "Drag and drop files here, or", hint, multiple = true }: { accept: string[]; maxBytes: number; onFiles: (files: File[]) => void; disabled?: boolean; title?: ReactNode; hint?: ReactNode; multiple?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const take = (list: FileList | null) => {
    if (!list || disabled) return;
    const ok: File[] = [];
    Array.from(list).forEach((f) => {
      if (!accept.includes(f.type)) notify.error(`${f.name}: unsupported file type.`);
      else if (f.size > maxBytes) notify.error(`${f.name}: larger than ${Math.round(maxBytes / 1024 / 1024)}MB.`);
      else ok.push(f);
    });
    if (ok.length) onFiles(multiple ? ok : ok.slice(0, 1));
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files); }}
      className={cn("flex flex-col items-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition-colors", over ? "border-brand bg-brand-soft/50" : "border-[#d9d4f7] bg-[#fbfaff]", disabled && "opacity-60")}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-[#dcf5ec] text-[#6d3fe0]"><CloudUpload className="size-5" /></span>
      <p className="mt-4 text-sm font-bold text-ink">
        {title}{" "}
        <button type="button" disabled={disabled} onClick={() => input.current?.click()} className="font-bold text-[#6d3fe0] underline underline-offset-2">Browse Files</button>
      </p>
      {hint ? <p className="mt-1.5 text-xs text-slate-400">{hint}</p> : null}
      <input ref={input} type="file" hidden multiple={multiple} accept={accept.join(",")} onChange={(e) => { take(e.target.files); e.target.value = ""; }} />
    </div>
  );
}
