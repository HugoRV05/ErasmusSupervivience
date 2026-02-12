"use client";

import { Wallet, PackageOpen, ClipboardList, GraduationCap, Settings2, PartyPopper, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface MascotProps {
  className?: string;
  size?: number;
  alt?: string;
  pose?: "default" | "thinking" | "happy" | "sad" | "scholar" | "explorer" | "mechanic" | string;
}

export function Mascot({ className, size = 120, pose = "default" }: MascotProps) {
  // Use Lucide icons as premium fallbacks since PNGs are currently invisible
  const iconMap: Record<string, React.ReactNode> = {
    expenses: <Wallet size={size * 0.6} className="text-primary" />,
    "pantry-empty": <PackageOpen size={size * 0.6} className="text-muted-foreground" />,
    lists: <ClipboardList size={size * 0.6} className="text-primary" />,
    schedule: <GraduationCap size={size * 0.6} className="text-primary" />,
    settings: <Settings2 size={size * 0.6} className="text-muted-foreground" />,
    success: <PartyPopper size={size * 0.6} className="text-green-500" />,
  };

  const IconNode = iconMap[pose] || <Smile size={size * 0.6} className="text-primary" />;

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-full bg-secondary/20 border border-border/50", 
        className
      )}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl opacity-50" />
      <div className="relative hover:scale-110 transition-transform duration-300 drop-shadow-sm">
        {IconNode}
      </div>
    </div>
  );
}
