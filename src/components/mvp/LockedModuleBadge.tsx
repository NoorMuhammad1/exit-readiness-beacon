import React from 'react';
import { Lock } from 'lucide-react';

/**
 * mini-mvp branch only.
 * Overlay rendered on top of locked module cards in the Lite Portal.
 * Position the parent as `relative` and this will fill it with a blurred lock overlay.
 */
export function LockedModuleBadge() {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] rounded-lg z-10 flex flex-col items-center justify-center gap-3 pointer-events-none">
      <div className="bg-muted rounded-full p-3">
        <Lock className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="text-center px-4">
        <p className="text-sm font-semibold text-muted-foreground">Full Launch Coming</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Unlock everything at full launch</p>
      </div>
    </div>
  );
}
