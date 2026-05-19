import { useRef, useCallback, useState } from "react";

const SWIPE_THRESHOLD = 80;

export function useSwipeToClose(onClose: () => void, enabled = true) {
  const [translateX, setTranslateX] = useState(0);
  const startX = useRef(0);
  const currentTranslateX = useRef(0);
  const isSwiping = useRef(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentTranslateX.current = 0;
    isSwiping.current = true;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const delta = e.touches[0].clientX - startX.current;
    if (delta > 0) {
      const damped = delta * 0.5;
      currentTranslateX.current = damped;
      setTranslateX(damped);
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    if (currentTranslateX.current > SWIPE_THRESHOLD && enabledRef.current) {
      onClose();
    } else {
      currentTranslateX.current = 0;
      setTranslateX(0);
    }
  }, [onClose]);

  const swipeStyle: React.CSSProperties =
    translateX > 0 ? { transform: `translateX(${translateX}px)` } : {};

  const isSwipingActive = translateX > 0;

  return { swipeStyle, isSwipingActive, onTouchStart, onTouchMove, onTouchEnd };
}
