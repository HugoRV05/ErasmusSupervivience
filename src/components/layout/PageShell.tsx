"use client";

import { ReactNode } from "react";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function PageShell({ title, subtitle, children, action }: PageShellProps) {
  return (
    <main className="min-h-screen pb-24 pt-[env(safe-area-inset-top)]">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-5 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      </header>
      <div className="px-5">{children}</div>
    </main>
  );
}
