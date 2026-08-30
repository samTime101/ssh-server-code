import { useEffect, useState } from "react";
import { getImageUrl } from "@/config/apiConfig";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  file?: File | null;
  existingSrc?: string | null;
  alt: string;
  className?: string;
}

const ImagePreview = ({ file, existingSrc, alt, className }: ImagePreviewProps) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const src = objectUrl ?? (existingSrc ? getImageUrl(existingSrc) : null);
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "border-border mt-1.5 h-20 w-20 rounded-md border object-cover",
        className
      )}
    />
  );
};

export default ImagePreview;
