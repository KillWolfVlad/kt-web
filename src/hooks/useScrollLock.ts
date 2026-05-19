import { useEffect } from "react";

function getScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth;
}

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollbarWidth = getScrollbarWidth();
    const scrollY = window.scrollY;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;
    const prevOverscrollBehavior = document.body.style.overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overscrollBehavior = "none";

    if (scrollbarWidth > 0) {
      const prevPaddingRight = document.body.style.paddingRight;
      const bodyComputedPadding = parseFloat(
        getComputedStyle(document.body).paddingRight,
      );
      document.body.style.paddingRight = `${bodyComputedPadding + scrollbarWidth}px`;

      return () => {
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.position = prevBodyPosition;
        document.body.style.top = prevBodyTop;
        document.body.style.width = prevBodyWidth;
        document.body.style.overscrollBehavior = prevOverscrollBehavior;
        document.body.style.paddingRight = prevPaddingRight;
        window.scrollTo(0, scrollY);
      };
    }

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.width = prevBodyWidth;
      document.body.style.overscrollBehavior = prevOverscrollBehavior;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
