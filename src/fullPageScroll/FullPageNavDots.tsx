import { MouseEventHandler, useCallback, useState } from "react";
import { useFullPageContext, useFullPageDispatch } from "./FullPageContext";
import styles from "./fullPageScroll.module.scss";

export type FullPageNavDotsProps = {
  location: "top" | "bottom" | "left" | "right";
};

export function FullPageNavDots(props: FullPageNavDotsProps) {
  const {
    ids,
    indexInView,
    viewportScrollAmount,
    scrollTiming,
    viewport,
    navBarHeight,
  } = useFullPageContext();

  const renderedNav = ids.map((id, index) => (
    <FullPageNavDot
      id={id}
      index={index}
      indexInView={indexInView}
      key={`full-page-nav-dot-${id}`}
    />
  ));

  const transition = {
    transform: `translate3d(0px, ${viewportScrollAmount}px, 0px)`,
    transition: `transform ${scrollTiming / 1000}s ease`,
  };

  return (
    <nav className={styles.fullPageNav} style={transition}>
      <ul>{renderedNav}</ul>
    </nav>
  );
}

type FullPageNavDotProps = {
  id: string;
  index: number;
  indexInView: number | null;
};


const hiddenLabelStyle = {right: "-20rem"};
const visibleLabelStyle = {right: "1.5rem"};

function FullPageNavDot(props: FullPageNavDotProps) {
  const { id, index, indexInView } = props;

  const dispatch = useFullPageDispatch();

  const [labelStyle, setLabelStyle] = useState({right: "-20rem"});

  // if id = pageInView, then set active page style
  const navStyles = `${styles.fullPageNavItem} ${
    index === indexInView ? styles.fullPageNavItemActive : ""
  }`;

  const handleClick = useCallback(() => {
    dispatch({ type: "setIndexInView", payload: index });
  }, [dispatch, index]);

  const handleMouseEnter = () => {
    setLabelStyle({...visibleLabelStyle});
  };

  const handleMouseLeave = () => {
    setLabelStyle({...hiddenLabelStyle})
  };

  return (
    <li>
      <a
        href={`#${id}`}
        onClick={handleClick}
        aria-label={`Link to ${id} section.`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={styles.fullPageNavItemLabel} style={labelStyle}>
          <p>{id}</p>
        </span>
        <span className={navStyles} />
      </a>
    </li>
  );
}
