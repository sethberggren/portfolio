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
import {
  checkContextAndDispatch,
  useFullPageContext,
  useFullPageDispatch,
} from "./FullPageContext";
import { FullPageNavDots, FullPageNavDotsProps } from "./FullPageNavDots";
import styles from "./fullPageScroll.module.scss";
import { FullPageNavBar, FullPageTopBarProps } from "./FullPageNavBar";

export type FullPageElements = {
  jsx: JSX.Element;
  id: keyof typeof appRoutes;
}[];

type FullPageScrollProps = {
  children: React.ReactNode | React.ReactNode[];
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
            console.log(type);
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
  const { children } = props;
  const [state, dispatch] = checkContextAndDispatch(
    useFullPageContext(),
    useFullPageDispatch()
  );

  const { viewport, indexInView, ids, hasNavBar, viewportScrollAmount } = state;

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
    const scrollAmount = indexInView * viewport.height;

    dispatch({ type: "setViewPortScrollAmount", payload: scrollAmount });
  }, [viewport, indexInView, dispatch]);

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      const variation = e.deltaY;

      if (variation > 0) {
        dispatch({ type: "scrollDown", payload: null });
      } else if (variation < 0) {
        dispatch({ type: "scrollUp", payload: null });
      }
    },
    [dispatch]
  );

  useEffect(() => {
    window.location.hash = ids[indexInView];
  }, [indexInView, ids]);

  useEffect(() => {
    document.addEventListener("wheel", handleScroll);

    return () => document.removeEventListener("wheel", handleScroll);
  }, [handleScroll]);

  const handleResize = useCallback(() => {

    console.log("handleResize has been called from inside fullPageScroll.tsx");
    dispatch({
      type: "setViewport",
      payload: { width: window.innerWidth, height: window.innerHeight },
    });
  }, [dispatch]);

  useEffect(() => {

    console.log("trying to set the event listenenr....");
    window.addEventListener("resize", () => handleResize());

    return () => window.removeEventListener("resize", () => handleResize());
  }, []);

  useEffect(() => {
    // sets the new index if the location is refreshed.  E.g., if the user navigates to www.foo.com/#bar the effect
    // will set the index in view to match the id of #bar.

    console.log(window.location.hash);
  }, []);

  useEffect(() => {
    console.log("Here's the viewport height" + viewport.height);
  }, [viewport]);

  const anchorTagsForIds = ids.map((id) => (
    <AnchorTagsForIds id={id} key={`anchor-${id}`} />
  ));

  const transition = {
    transform: `translate3d(0px, -${viewportScrollAmount}px, 0px)`,
    transition: `transform 0.5s ease`,
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
