import { useEffect, useRef, useState } from "react";

export default function useSwipe(element: HTMLElement | null) {
  const xDown = useRef<number | null>(null);
  const yDown = useRef<number | null>(null);

  const [swipeDirection, setSwipeDirection] = useState<null | "left" | "right">(
    null
  );

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      xDown.current = e.touches[0].clientX;
      yDown.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (xDown.current === null || yDown.current === null) {
        return;
      }

      const xUp = e.touches[0].clientX;
      const yUp = e.touches[0].clientY;

      const xDiff = xDown.current - xUp;
      const yDiff = yDown.current - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          setSwipeDirection("right");
        } else {
          setSwipeDirection("left");
        }
      }
    };

    if (element !== null) {
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchmove", handleTouchEnd);
    }

    return () => {
      element?.removeEventListener("touchstart", handleTouchStart);
      element?.removeEventListener("touchmove", handleTouchEnd);
    };
  }, [element]);

  return swipeDirection;
}
