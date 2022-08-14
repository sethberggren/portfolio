import { useEffect, useRef, useState } from "react";

export default function useSwipe(element: HTMLElement | null) {
  const xDown = useRef<number | null>(null);
  const yDown = useRef<number | null>(null);

  const [swipeDirection, setSwipeDirection] = useState<null | "left" | "right">(
    null
  );

  const swipeTimeout = useRef<number>(500);

  const setSwipeTimeout = () => {
    setTimeout(() => setSwipeDirection(null), swipeTimeout.current);
  }

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
        e.preventDefault();
        if (xDiff > 0) {
          console.log("right swipe");
          setSwipeDirection("right");
          setSwipeTimeout();
        } else {
          console.log("left swipe");
          setSwipeDirection("left");
          setTimeout(() => setSwipeDirection(null), swipeTimeout.current);
          setSwipeTimeout();
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
