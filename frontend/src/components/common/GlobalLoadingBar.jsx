import React, { useEffect, useState } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useRouterState } from '@tanstack/react-router';
import { Loader2, Sparkles } from 'lucide-react';
import { useLoadingStore } from '../../store/loadingStore';

export default function GlobalLoadingBar() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const activeRequests = useLoadingStore((state) => state.activeRequests);
  
  // Tangkap status loading dari router
  const routerState = useRouterState({
    select: (s) => s.status === 'pending' || s.isLoading,
  });

  const isLoading = isFetching > 0 || isMutating > 0 || activeRequests > 0 || Boolean(routerState);

  // Animasi progress bar halus
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    let finishTimer;

    if (isLoading) {
      setVisible(true);
      setProgress(25);

      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          const diff = Math.random() * 15;
          return Math.min(prev + diff, 90);
        });
      }, 200);
    } else if (visible) {
      setProgress(100);
      finishTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 350);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(finishTimer);
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <>
      {/* 1. TOP PROGRESS BAR (Glow Emerald Line) */}
      <div className="fixed top-0 left-0 right-0 z-[99999] h-1 bg-transparent pointer-events-none overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-teal-300 shadow-[0_0_15px_rgba(16,185,129,0.9)] transition-all duration-300 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer light effect moving across */}
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-r from-transparent via-white/80 to-white animate-pulse" />
        </div>
      </div>

      {/* 2. FLOATING MICRO INDICATOR PILL (Top Center / Top Right) */}
      <div className="fixed top-3 right-3 sm:right-6 z-[99999] pointer-events-none animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/85 dark:bg-black/90 text-white backdrop-blur-md shadow-xl border border-emerald-500/40 text-xs font-semibold">
          <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin shrink-0" />
          <span className="text-[11px] font-medium tracking-wide text-emerald-100">
            {isMutating > 0 ? 'Menyimpan...' : 'Memuat data...'}
          </span>
        </div>
      </div>
    </>
  );
}
