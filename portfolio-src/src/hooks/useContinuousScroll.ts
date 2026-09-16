import { useEffect, useRef, useState, useCallback } from 'react';

interface UseContinuousScrollOptions {
  totalItems: number;
  itemSpacing?: number;
  damping?: number;
}

export function useContinuousScroll({
  totalItems,
  damping = 0.08,
}: UseContinuousScrollOptions) {
  // progressRef holds the continuous, sub-frame progress (e.g. 0.0 to totalItems - 1)
  const progressRef = useRef<number>(0);
  const targetProgressRef = useRef<number>(0);
  const isInteractingRef = useRef<boolean>(false);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Wheel listener with auto-snap on gesture end
  useEffect(() => {
    let lastWheelTime = 0;

    const scheduleSnap = () => {
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
      // After scroll gesture ends, smoothly snap to nearest item index
      snapTimeoutRef.current = setTimeout(() => {
        targetProgressRef.current = Math.max(
          0,
          Math.min(totalItems - 1, Math.round(targetProgressRef.current))
        );
        isInteractingRef.current = false;
      }, 160);
    };

    const handleWheel = (e: WheelEvent) => {
      // Don't scroll stack if user is scrolling inside the inspect card
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.inspect-card')) {
        return;
      }

      e.preventDefault();
      lastWheelTime = performance.now();
      isInteractingRef.current = true;

      // Responsive wheel delta
      const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * 0.0025, 0.45);
      
      targetProgressRef.current = Math.max(
        0,
        Math.min(totalItems - 1, targetProgressRef.current + delta)
      );

      scheduleSnap();
    };

    // Keyboard navigation (direct discrete jump)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        targetProgressRef.current = Math.min(
          totalItems - 1,
          Math.round(targetProgressRef.current + 1)
        );
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        targetProgressRef.current = Math.max(
          0,
          Math.round(targetProgressRef.current - 1)
        );
      }
    };

    // Touch events for mobile/tablets
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.inspect-card')) return;
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      touchStartY = e.touches[0].clientY;
      isInteractingRef.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.inspect-card')) return;
      
      const touchY = e.touches[0].clientY;
      const delta = (touchStartY - touchY) * 0.005;
      touchStartY = touchY;

      targetProgressRef.current = Math.max(
        0,
        Math.min(totalItems - 1, targetProgressRef.current + delta)
      );
    };

    const handleTouchEnd = () => {
      // Snap to nearest item when touch releases
      targetProgressRef.current = Math.max(
        0,
        Math.min(totalItems - 1, Math.round(targetProgressRef.current))
      );
      isInteractingRef.current = false;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Animation frame loop for smooth lerp damping
    let rafId: number;
    let lastActive = 0;

    const tick = () => {
      const diff = targetProgressRef.current - progressRef.current;
      if (Math.abs(diff) > 0.0001) {
        progressRef.current += diff * damping;
      } else {
        progressRef.current = targetProgressRef.current;
      }

      // Update active index in React state only when integer focus changes
      const currentInt = Math.round(progressRef.current);
      if (currentInt !== lastActive) {
        lastActive = currentInt;
        setActiveIndex(currentInt);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(rafId);
    };
  }, [totalItems, damping]);

  // Jump smoothly to a specific project (e.g. from clicking the left title list)
  const jumpToIndex = useCallback((index: number) => {
    targetProgressRef.current = Math.max(0, Math.min(totalItems - 1, index));
  }, [totalItems]);

  return {
    progressRef,
    activeIndex,
    jumpToIndex,
    isInteractingRef,
  };
}
