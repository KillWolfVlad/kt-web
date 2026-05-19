import { useRef, useCallback, useState } from "react";

const SWIPE_THRESHOLD = 80;
const SWIPE_DEAD_ZONE = 15;
const SWIPE_ANGLE_FACTOR = 2;

export function useSwipeToClose(onClose: () => void, enabled = true) {
  const [translateX, setTranslateX] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentTranslateX = useRef(0);
  const isSwiping = useRef(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentTranslateX.current = 0;
    isSwiping.current = false;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - startX.current;
    const deltaY = e.touches[0].clientY - startY.current;

    if (!isSwiping.current) {
      if (deltaX > SWIPE_DEAD_ZONE && deltaX > Math.abs(deltaY) * SWIPE_ANGLE_FACTOR) {
        isSwiping.current = true;
      } else {
        return;
      }
    }

    if (deltaX > 0) {
      const damped = deltaX * 0.5;
      currentTranslateX.current = damped;
      setTranslateX(damped);
    } else if (currentTranslateX.current > 0) {
      currentTranslateX.current = 0;
      setTranslateX(0);
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
