import { useEffect } from "react";
import { useCarouselContext, useCarouselDispatch } from "./CarouselContext";
import styles from "./carousel.module.scss";

type CarouselItemProps = {
  index: number;
  children: React.ReactNode;
  referenceId: string;
};

export default function CarouselItem(props: CarouselItemProps) {
  const { children, index, referenceId } = props;

  const dispatch = useCarouselDispatch();

  const { carouselItemWidth, arrowWidth } = useCarouselContext();

  useEffect(() => {
    dispatch({ type: "addId", payload: { id: referenceId, index: index } });
  }, [index, referenceId, dispatch]);

  const carouselId = `carousel-${referenceId}`;

  return (
    <div
      id={carouselId}
      style={{
        width: `${carouselItemWidth}px`,
        marginLeft: `${arrowWidth}px`,
        marginRight: `${arrowWidth}px`,
      }}
      className={styles.carouselItem}
    >
      {children}
    </div>
  );
}
