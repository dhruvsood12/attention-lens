import { useCallback, useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      onChange(url);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (value) {
    return (
      <div className="relative group rounded-lg overflow-hidden border border-border bg-secondary h-32">
        <img src={value} alt="Thumbnail preview" className="w-full h-full object-cover" />
        <button
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-2 h-32 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
        dragOver ? "border-primary/50 bg-primary/5" : "border-border hover:border-muted-foreground/30 bg-secondary/50"
      }`}
    >
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      {dragOver ? <ImageIcon className="h-6 w-6 text-primary" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
      <span className="text-xs text-muted-foreground">{dragOver ? "Drop image here" : "Upload thumbnail (optional)"}</span>
    </div>
  );
}
