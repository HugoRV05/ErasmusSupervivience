"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface MascotProps {
  className?: string;
  size?: number;
  alt?: string;
  pose?: "default" | "thinking" | "happy" | "sad"; // Placeholder for future poses
}

export function Mascot({ className, size = 120, alt = "Erasmus Monkey", pose = "default" }: MascotProps) {
  // Map poses to images (currently all same image until user provides more)
  const src = "/mascot/mascot.webp";

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
        priority
      />
    </div>
  );
}
