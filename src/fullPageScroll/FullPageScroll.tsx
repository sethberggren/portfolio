import React, { useCallback, useEffect, useRef, useState } from "react";
import appRoutes from "../routes";
import { FullPageContent } from "./FullPageContent";
import {
  providerProps,
  useFullPageContext,
  useFullPageDispatch,
} from "./FullPageContext";
import { FullPageNavDots } from "./FullPageNavDots";
import styles from "./fullPageScroll.module.scss";
import { FullPageNavBar } from "./FullPageNavBar";
import { StateManagementProvider } from "../state/stateManagment";
import { betweenSectionRange } from "../helperFunctions";

type FullPageScrollProps = {
  children: React.ReactNode | React.ReactNode[];
  customScrollTiming?: number;
};

const mobileBreakpoint = 992;

const childComponentSetup = (children: React.ReactNode) => {
  let allValid = true;
  let numOfPanels = 0;

  React.Children.forEach(children, (child) => {
    if (child) {
      if (
        typeof child !== "string" &&
        typeof child !== "number" &&
        typeof child !== "boolean"
      ) {
        const type = (child as any).type;

        if (type) {
          if (
            type !== FullPageNavBar &&
            type !== FullPageContent &&
            type !== FullPageNavDots
          ) {
            allValid = false;
          }

          if (type === FullPageContent) {
            numOfPanels++;
          }
        }
      } else {
        allValid = false;
      }
    } else {
      allValid = false;
    }
  });

  return [allValid, numOfPanels] as const;
};

export default function FullPageScroll(props: FullPageScrollProps) {
  const { children, customScrollTiming } = props;

  return (
    <StateManagementProvider providerProps={providerProps}>
      <FullPageContainer customScrollTiming={customScrollTiming}>
        {children}
      </FullPageContainer>
    </StateManagementProvider>
  );
}

function FullPageContainer(props: FullPageScrollProps) {
  const { children, customScrollTiming } = props;

  const {
    viewport,
    indexInView,
    ids,
    viewportScrollAmount,
    scrollTiming,
    canScroll,
    isMobile,
    sectionThresholds,
  } = useFullPageContext();

  const dispatch = useFullPageDispatch();

  const fullPageRef = useRef<HTMLDivElement>(null);

  const previousScroll = useRef<number>(0);

  useEffect(() => {
    if (customScrollTiming) {
      dispatch({ type: "setScrollTiming", payload: customScrollTiming });
    }
  }, [customScrollTiming]);

  useEffect(() => {
    const [allValid, numOfPanels] = childComponentSetup(children);

    if (!allValid) {
      throw new Error(
        "Must only use FullPageTopBar, FullPageContent, or FullPageNavDots as child components for the FullPageScroll wrapper component."
      );
    }

    dispatch({ type: "setNumOfPanels", payload: numOfPanels });
  }, [children, dispatch]);

  useEffect(() => {
    if (indexInView !== null) {
      const scrollAmount = indexInView * viewport.height;

      dispatch({ type: "setViewPortScrollAmount", payload: scrollAmount });
    } else {
      dispatch({ type: "setViewPortScrollAmount", payload: 0 });
    }
  }, [viewport, indexInView, dispatch]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isMobile) {
        const variation = e.deltaY;

        if (variation > 0 && canScroll) {
          dispatch({ type: "scrollDown", payload: null });
          dispatch({ type: "setCanScroll", payload: false });
          window.setTimeout(() => {
            dispatch({ type: "setCanScroll", payload: true });
          }, scrollTiming);
        } else if (variation < 0 && canScroll) {
          dispatch({ type: "scrollUp", payload: null });
          dispatch({ type: "setCanScroll", payload: false });
          window.setTimeout(() => {
            dispatch({ type: "setCanScroll", payload: true });
          }, scrollTiming);
        }
      }
    },
    [canScroll, scrollTiming, isMobile, dispatch]
  );

  useEffect(() => {
    if (indexInView !== null) {
      window.history.replaceState(null, "", `#${ids[indexInView]}`);
    }
  }, [indexInView, ids]);

  useEffect(() => {
    document.addEventListener("wheel", handleWheel);

    return () => document.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const handleResize = useCallback(() => {
    dispatch({
      type: "setViewport",
      payload: {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      },
    });

    if (window.innerWidth < mobileBreakpoint) {
      dispatch({ type: "setIsMobile", payload: true });
    } else {
      dispatch({ type: "setIsMobile", payload: false });
    }
  }, [dispatch]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) {
        const scrollDirection =
          window.scrollY - previousScroll.current > 0 ? "up" : "down";

        const newIndexInView = betweenSectionRange(
          ids,
          sectionThresholds,
          window.scrollY,
          scrollDirection
        );

        previousScroll.current = window.scrollY;

        if (ids[indexInView as number] !== newIndexInView) {
          dispatch({ type: "setIndexFromId", payload: newIndexInView });
        }
      } else {
        console.log("is not mobile, cannot handle scroll.");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, indexInView, ids, sectionThresholds]);

  useEffect(() => {
    window.onload = () => {
      const hash = window.location.hash.replace("#", "");

      if (hash === "undefined" || hash === "") {
        dispatch({type: "setIndexInView", payload: 0});
      }

      dispatch({ type: "setIndexFromId", payload: hash });
    };

    return () => {
      window.onload = null;
    };
  }, []);

  const anchorTagsForIds = ids.map((id) => (
    <AnchorTagsForIds id={id} key={`anchor-${id}`} />
  ));

  const transition = !isMobile
    ? {
        transform: `translate3d(0px, -${viewportScrollAmount}px, 0px)`,
        transition: `transform ${scrollTiming / 1000}s ease`,
      }
    : undefined;
  return (
    <>
      {anchorTagsForIds}
      <div
        className={styles.fullPageContainer}
        style={transition}
        id="main"
        ref={fullPageRef}
      >
        {!isMobile ? <FullPageNavDots location="right" /> : null}
        {children}
      </div>
    </>
  );
}

function AnchorTagsForIds(props: { id: string }) {
  const { id } = props;

  return <a id={id} href={`#${id}`}></a>;
}
