import { useCarouselContext, useCarouselDispatch } from "./CarouselContext";
import { useCallback, useEffect } from "react";
import styles from "./carousel.module.scss";

export default function CarouselNavDots() {
  const { ids, indexInView, viewportScrollAmount, scrollTiming } =
    useCarouselContext();

  const dispatch = useCarouselDispatch();

  useEffect(() => {
    dispatch({ type: "setHasNavDots", payload: true });
  }, [dispatch]);

  const renderedNavItems = ids.map((id, index) => (
    <CarouselNavDot id={id} index={index} indexInView={indexInView} key={`carousel-nav-dot-${id}`}/>
  ));

  return (
    <nav className={styles.carouselNav}>
      <ul>{renderedNavItems}</ul>
    </nav>
  );
}

type CarouselNavDotProps = {
  id: string;
  index: number;
  indexInView: number;
};

function CarouselNavDot(props: CarouselNavDotProps) {
  const { id, index, indexInView } = props;

  const dispatch = useCarouselDispatch();

  // if id = pageInView, then set active page style
  const navStyles = `${styles.carouselNavItem} ${
    index === indexInView ? styles.carouselNavItemActive : ""
  }`;

  const handleClick = useCallback(() => {
    dispatch({ type: "setIndexInView", payload: index });
  }, [dispatch, index]);

  return (
    <li>
      {/* mabye make this into a div? not using hrefs...*/}
      <div onClick={handleClick} aria-label={`Link to ${id} section.`}>
        <span className={navStyles} />
      </div>
    </li>
  );
}
