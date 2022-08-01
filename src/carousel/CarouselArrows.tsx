import { forwardRef} from "react";
import styles from "./carousel.module.scss";
import { useCarouselContext, useCarouselDispatch } from "./CarouselContext";

const CarouselArrows = forwardRef<HTMLButtonElement>((props, ref) => {

  const {arrowWidth,carouselItemDimensions} = useCarouselContext();
  const dispatch = useCarouselDispatch();

  const arrowWidthStyle = {
    width: `${arrowWidth}px`,
    height: `${carouselItemDimensions.height}px`
  }

  return (
    <>
     <button
        className={styles.carouselArrow}
        style={{...arrowWidthStyle, left: "0%"}}
        ref={ref}
        aria-label={`Move items left`}
        onClick={() => dispatch({ type: "shiftLeft", payload: null })}
      >
        {leftButton}
      </button>

      <button
        className={styles.carouselArrow}
        style={{...arrowWidthStyle, right: "0%"}}
        aria-label={`Move items right`}
        onClick={() => dispatch({ type: "shiftRight", payload: null })}
      >
        {rightButton}
      </button>
    </>
     
  );
});

const leftButton = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className={styles.carouselArrowIcon}>
    <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" />
  </svg>
);
const rightButton = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className={styles.carouselArrowIcon}>
    <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
  </svg>
);

export default CarouselArrows;
