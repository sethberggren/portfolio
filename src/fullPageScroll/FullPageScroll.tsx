import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import appRoutes from "../routes";
import { useGlobalContext } from "../state/globalContext";
import { createStateManagement } from "../state/stateManagment";
import { FullPageContent, FullPageContentProps } from "./FullPageContent";
import { useFullPageContext, useFullPageDispatch } from "./FullPageContext";
import { FullPageNavDots, FullPageNavDotsProps } from "./FullPageNavDots";
import styles from "./fullPageScroll.module.scss";
import { FullPageTopBar, FullPageTopBarProps } from "./FullPageTopBar";

export type FullPageElements = {
  jsx: JSX.Element;
  id: keyof typeof appRoutes;
}[];

type FullPageScrollProps = {
  children: React.ReactElement<FullPageNavDotsProps> | React.ReactElement<FullPageContentProps>[] | React.ReactElement<FullPageTopBarProps>;
};

const childComponentSetup = (children: React.ReactElement<any> | React.ReactElement<any>[]) => {
  let allValid = true;
  let numOfPanels = 0;

  React.Children.forEach(children, (child) => {

    const type = child.type;

    if (type !== FullPageTopBar || type !== FullPageContent || type !== FullPageNavDots) {
      allValid = false
    };

    if (type === FullPageContent) {
      numOfPanels ++;
    }
  })

  return [allValid, numOfPanels] as const;
}


export default function FullPageScroll(props: FullPageScrollProps) {

  const { children } = props;
  const state = useFullPageContext();
  const dispatch = useFullPageDispatch();

  if (!state || !dispatch) {
    throw new Error("FullPageScroll must be called with FullPageProvider.");
  }

  const {viewport} = state;

 
  useEffect(() => {
    const [allValid, numOfPanels] = childComponentSetup(children);

    if (!allValid) {
      throw new Error("Must only use FullPageTopBar, FullPageContent, or FullPageNavDots as child components for the FullPageScroll wrapper component.");
    }

    dispatch({type: "setNumOfPanels", payload: numOfPanels})

  }, [children]);

  const viewportScrollAmount = viewport.height * indexInView;

  const scrollDown = () => {
    if (indexInView < numOfElements - 1) {
      setIndexInView(indexInView + 1);
    }
  };

  const scrollUp = () => {
    console.log("scroll up function has been called");
    console.log(indexInView);
    if (indexInView > 0) {
      console.log("index is in range");
      setIndexInView(indexInView - 1);
    }
  };

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      const variation = e.deltaY;

      if (variation > 0) {
        scrollDown();
      } else if (variation < 0) {
        scrollUp();
      }
    },
    [scrollUp, scrollDown]
  );

  useEffect(() => {
    setPageInView(elements[indexInView].id);
    window.location.hash = elements[indexInView].id;
  }, [indexInView]);

  useEffect(() => {
    document.addEventListener("wheel", handleScroll);

    return () => document.removeEventListener("wheel", handleScroll);
  }, [handleScroll]);

  const renderedElements = elements.map(
    (element) => (
      <FullPageElement id={element.id} key={`page-${element.id}`}>
        {element.jsx}
      </FullPageElement>
    ),
    [elements]
  );

  const renderedNav = elements.map((element, index) => (
    <FullPageNavItem
      id={element.id}
      key={`nav-${element.id}`}
      index={index}
      indexInView={indexInView}
      setIndexInView={setIndexInView}
    />
  ));

  const anchorTagsForIds = elements.map((element) => (
    <AnchorTagsForIds id={element.id} key={`anchor-${element.id}`} />
  ));

  return (
    <>
      {anchorTagsForIds}

      <div
        className={styles.fullPageContainer}
        style={{
          transform: `translate3d(0px, -${viewportScrollAmount}px, 0px)`,
          transition: `transform 0.5s ease`,
        }}
      >
        <nav
          className={styles.fullPageNav}
          style={{
            transform: `translate3d(0px, ${viewportScrollAmount}px, 0px)`,
            transition: `transform 0.5s ease`,
          }}
        >
          <ul>{renderedNav}</ul>
        </nav>

        {renderedElements}
      </div>
    </>
  );
}

type FullPageNavProps = {
  id: keyof typeof appRoutes;
  index: number;
  indexInView: number;
  setIndexInView: React.Dispatch<React.SetStateAction<number>>;
};

function FullPageNavItem(props: FullPageNavProps) {
  const { id, index, indexInView, setIndexInView } = props;

  // if id = pageInView, then set active page style
  const navStyles = `${styles.fullPageNavItem} ${
    index === indexInView ? styles.fullPageNavItemActive : ""
  }`;

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    setIndexInView(index);
  };

  return (
    <li>
      <a href={`#${id}`} onClick={handleClick}>
        <span className={navStyles} />
      </a>
    </li>
  );
}

function AnchorTagsForIds(props: { id: keyof typeof appRoutes }) {
  const { id } = props;

  return <a id={id}></a>;
}
