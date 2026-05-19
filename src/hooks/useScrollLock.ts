import { useEffect } from "react";

function getScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth;
}

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth === 0) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const bodyComputedPadding = parseFloat(
      getComputedStyle(document.body).paddingRight,
    );

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${bodyComputedPadding + scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [locked]);
}
