"use client";

import { ImagePlus, Link2, Loader2, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { errorMessage, uploadImage } from "@/lib/api";
import { isHttpUrl } from "@/lib/validation";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  // "upload" for service images (the brief requires a real upload), "both" adds an image URL option
  mode?: "upload" | "both";
  shape?: "wide" | "round";
  invalid?: boolean;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  onUploadingChange,
  mode = "upload",
  shape = "wide",
  invalid = false,
  label = "Upload image",
}: ImageUploaderProps) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlDraft, setUrlDraft] = useState("");

  async function handle(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    onUploadingChange?.(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(errorMessage(err, "Image upload failed. Please try again."));
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      if (input.current) input.current.value = "";
    }
  }

  function useUrl() {
    const url = urlDraft.trim();
    if (!isHttpUrl(url)) {
      toast.error("Please paste a full image link starting with https://");
      return;
    }
    onChange(url);
    setUrlDraft("");
  }

  const round = shape === "round";

  return (
    <div>
      {mode === "both" && (
        <div className="mb-3 inline-flex rounded-full bg-sand p-1 text-xs font-semibold">
          {(["upload", "url"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 transition ${tab === t ? "bg-white text-ink shadow-soft" : "text-muted"}`}
            >
              {t === "upload" ? <UploadCloud className="size-3.5" /> : <Link2 className="size-3.5" />}
              {t === "upload" ? "Upload file" : "Image URL"}
            </button>
          ))}
        </div>
      )}

      <div className={`flex gap-4 ${round ? "items-center" : "flex-col"}`}>
        {value ? (
          <div className={`relative shrink-0 overflow-hidden bg-sand ${round ? "size-20 rounded-full ring-4 ring-sand" : "aspect-[16/9] w-full rounded-2xl"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Selected image preview" className="size-full object-cover" referrerPolicy="no-referrer" />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/50 text-white">
                <Loader2 className="size-6 animate-spin" />
              </div>
            )}
          </div>
        ) : round ? (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-sand text-muted ring-4 ring-sand/60">
            {uploading ? <Loader2 className="size-6 animate-spin text-gold" /> : <ImagePlus className="size-6" />}
          </div>
        ) : null}

        {tab === "upload" || mode === "upload" ? (
          value && !round ? (
            <div className="flex gap-2">
              <button type="button" onClick={() => input.current?.click()} disabled={uploading} className="btn btn-outline btn-sm">
                <RefreshCw className="size-4" /> Replace image
              </button>
              <button type="button" onClick={() => onChange("")} disabled={uploading} className="btn btn-ghost btn-sm text-rose">
                <Trash2 className="size-4" /> Remove
              </button>
            </div>
          ) : round ? (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => input.current?.click()} disabled={uploading} className="btn btn-outline btn-sm">
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
                {uploading ? "Uploading…" : value ? "Change photo" : label}
              </button>
              {value && !uploading && (
                <button type="button" onClick={() => onChange("")} className="btn btn-ghost btn-sm text-rose">
                  Remove
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => input.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handle(e.dataTransfer.files?.[0]);
              }}
              disabled={uploading}
              aria-invalid={invalid || undefined}
              className={`flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 text-center transition ${
                dragging ? "border-gold bg-gold-soft/40" : invalid ? "border-rose/60 bg-rose-50/40" : "border-line bg-cream hover:border-gold/70 hover:bg-sand/50"
              }`}
            >
              {uploading ? <Loader2 className="size-8 animate-spin text-gold" /> : <UploadCloud className="size-8 text-gold" />}
              <span className="text-sm font-semibold text-ink">{uploading ? "Uploading to ImgBB…" : "Click to upload or drag an image here"}</span>
              <span className="text-xs text-muted">JPG, PNG or WebP · up to 4 MB</span>
            </button>
          )
        ) : (
          <div className="flex w-full gap-2">
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  useUrl();
                }
              }}
              placeholder="https://example.com/photo.jpg"
              className="input"
            />
            <button type="button" onClick={useUrl} className="btn btn-dark shrink-0">
              Use
            </button>
          </div>
        )}
      </div>

      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" className="hidden" onChange={(e) => handle(e.target.files?.[0])} />
    </div>
  );
}
