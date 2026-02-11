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
  // Map named poses to index-based poses for now
  const poseMap: Record<string, string> = {
    default: "pose_1",
    happy: "pose_2",
    thinking: "pose_3",
    sad: "pose_4",
    scholar: "pose_5",
    explorer: "pose_6",
    mechanic: "pose_7",
  };

  const poseFile = poseMap[pose] || (pose.startsWith("pose_") ? pose : "pose_1");
  const src = `/mascot/${poseFile}.png`;

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
