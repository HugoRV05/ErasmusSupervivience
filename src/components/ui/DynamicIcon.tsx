"use client";

import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  // @ts-ignore - Dynamically access icons
  const IconComponent = Icons[name];

  if (!IconComponent) {
    // Fallback icon if name not found
    return <Icons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
}
