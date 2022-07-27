import React, {
  useCallback,
  useEffect,
} from "react";
import appRoutes from "../routes";
import { FullPageContent } from "./FullPageContent";
import {
  checkContextAndDispatch,
  providerProps,
  useFullPageContext,
  useFullPageDispatch,
} from "./FullPageContext";
import { FullPageNavDots } from "./FullPageNavDots";
import styles from "./fullPageScroll.module.scss";
import { FullPageNavBar } from "./FullPageNavBar";
import { StateManagementProvider } from "../state/stateManagment";



type FullPageScrollProps = {
  children: React.ReactNode | React.ReactNode[];
  customScrollTiming?: number;
};

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
  const {children, customScrollTiming} = props;

  return (
    <StateManagementProvider providerProps={providerProps}>
      <FullPageContainer customScrollTiming={customScrollTiming}>
        {children}
      </FullPageContainer>

    </StateManagementProvider>
  )

}

function FullPageContainer(props: FullPageScrollProps) {
  const { children, customScrollTiming } = props;
  const [state, dispatch] = checkContextAndDispatch(
    useFullPageContext(),
    useFullPageDispatch()
  );

  const {
    viewport,
    indexInView,
    ids,
    hasNavBar,
    viewportScrollAmount,
    scrollTiming,
    canScroll,
  } = state;

  useEffect(() => {
    if (scrollTiming) {
      dispatch({ type: "setScrollTiming", payload: scrollTiming });
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
    if (indexInView) {
      const scrollAmount = indexInView * viewport.height;

      dispatch({ type: "setViewPortScrollAmount", payload: scrollAmount });
    } else {
      dispatch({ type: "setViewPortScrollAmount", payload: 0 });
    }
  }, [viewport, indexInView, dispatch]);

  const handleScroll = useCallback(
    (e: WheelEvent) => {
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
    },
    [canScroll, scrollTiming, dispatch]
  );

  useEffect(() => {
    if (indexInView !== null) {
      window.location.hash = ids[indexInView];
    }
  }, [indexInView, ids]);

  useEffect(() => {
    document.addEventListener("wheel", handleScroll);

    return () => document.removeEventListener("wheel", handleScroll);
  }, [handleScroll]);

  const handleResize = useCallback(() => {
    dispatch({
      type: "setViewport",
      payload: { width: window.innerWidth, height: window.innerHeight },
    });
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener("resize", () => handleResize());

    return () => window.removeEventListener("resize", () => handleResize());
  }, [handleResize]);

  useEffect(() => {
    // sets the index in view when the hash location changes.

    window.onhashchange = () => {
      const hash = window.location.hash.replace("#", "");

      if (hash !== "undefined") {
        dispatch({ type: "setIndexFromId", payload: hash });
      }
    };

    return () => {
      window.onhashchange = null;
    };
  }, [dispatch]);

  useEffect(() => {
    // sets the new index of the hash location the user is trying to visit.  E.g., if the user navigates to www.foo.com/#bar the effect
    // will set the index in view to match the id of #bar.

    const hash = window.location.hash.replace("#", "");

    if (hash !== "undefined") {
      dispatch({ type: "setIndexFromId", payload: hash });
    } else {
      dispatch({ type: "setIndexInView", payload: 0 });
    }
  }, []);

  const anchorTagsForIds = ids.map((id) => (
    <AnchorTagsForIds id={id} key={`anchor-${id}`} />
  ));

  const transition = {
    transform: `translate3d(0px, -${viewportScrollAmount}px, 0px)`,
    transition: `transform ${scrollTiming / 1000}s ease`,
  };

  return (
    <>
      {anchorTagsForIds}

      <div className={styles.fullPageContainer} style={transition} id="main">
        {children}
      </div>
    </>
  );
}

function AnchorTagsForIds(props: { id: string }) {
  const { id } = props;

  return <a id={id}></a>;
}
