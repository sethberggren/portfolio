import { useEffect, useRef } from "react";
import { useCarouselContext, useCarouselDispatch } from "./CarouselContext";
import styles from "./carousel.module.scss";
import useSwipe from "./useSwipe";

type CarouselItemProps = {
  index: number;
  children: React.ReactNode;
  referenceId: string;
};

export default function CarouselItem(props: CarouselItemProps) {
  const { children, index, referenceId } = props;

  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useCarouselDispatch();

  const { carouselItemDimensions, arrowWidth } = useCarouselContext();

  useEffect(() => {
    dispatch({ type: "addId", payload: { id: referenceId, index: index } });
  }, [index, referenceId, dispatch]);

  const swipeDirection = useSwipe(ref.current as HTMLDivElement);

  useEffect(() => {
    if (swipeDirection === "left") {
      dispatch({ type: "shiftLeft", payload: null });
    } else if (swipeDirection === "right") {
      dispatch({ type: "shiftRight", payload: null });
    }
  }, [swipeDirection]);

  const carouselId = `carousel-${referenceId}`;

  return (
    <div
      id={carouselId}
      style={{
        width: `${carouselItemDimensions.width}px`,
        height: `${carouselItemDimensions.height}px`,
        marginLeft: `${arrowWidth}px`,
        marginRight: `${arrowWidth}px`,
      }}
      className={styles.carouselItem}
      ref={ref}
    >
      {children}
    </div>
  );
}
