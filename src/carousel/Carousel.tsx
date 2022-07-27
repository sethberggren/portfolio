import React, { useEffect, useCallback, useState } from "react";
import { StateManagementProvider } from "../state/stateManagment";
import CarouselArrows from "./CarouselArrows";
import {
  providerProps,
  useCarouselContext,
  useCarouselDispatch,
} from "./CarouselContext";
import CarouselItem from "./CarouselItem";
import CarouselNavDots from "./CarouselNavDots";
import styles from "./carousel.module.scss";

type CarouselProps = {
  children: React.ReactNode | React.ReactNode[];
  displaySize: { width: string; height: string };
  scrollTiming?: number;
};

export default function Carousel(props: CarouselProps) {
  const { displaySize, scrollTiming, children } = props;

  return (
    <StateManagementProvider providerProps={providerProps}>
      <CarouselContainer displaySize={displaySize} scrollTiming={scrollTiming}>
        {children}
      </CarouselContainer>
    </StateManagementProvider>
  );
}

function childComponentSetup(children: JSX.Element | JSX.Element[]) {
  let allValid = true;
  let numOfPanels = 0;
  let carouselItems = [] as JSX.Element[];

  React.Children.forEach(children, (child) => {
    const type = child.type;

    if (
      type !== CarouselArrows &&
      type !== CarouselNavDots &&
      type !== CarouselItem
    ) {
      allValid = false;
    }

    if (type === CarouselItem) {
      numOfPanels++;
      carouselItems.push(child);
    }
  });

  return [allValid, numOfPanels, carouselItems] as const;
}

function CarouselContainer(props: CarouselProps) {
  const {
    displaySize,
    scrollTiming: customScrollTiming,
    children,
  } = props;

  const {
    viewport,
    indexInView,
    ids,
    viewportScrollAmount,
    scrollTiming,
    hasArrows,
    hasNavDots,
  } = useCarouselContext();
  const dispatch = useCarouselDispatch();

  const [carouselItems, setCarouselItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const [allValid, numOfPanels, carouselItems] = childComponentSetup(
      children as JSX.Element[]
    );

    if (!allValid) {
      throw new Error(
        "Must only use CarouselArrows, CarouselNavDots, or CarouselItem as child components for the Carousel component."
      );
    }

    setCarouselItems(carouselItems);
    dispatch({ type: "setNumOfPanels", payload: numOfPanels });
  }, [children, dispatch]);

  useEffect(() => {
    if (customScrollTiming) {
      dispatch({ type: "setScrollTiming", payload: customScrollTiming });
    }
  }, [customScrollTiming, dispatch]);

  const anchorTagsForIds = ids.map((id) => (
    <AnchorTagsForIds id={id} key={`anchor-${id}`} />
  ));

  const transition = {
    transform: `translateX(-${indexInView*100}%)`,
    transition: `transform ${scrollTiming / 1000}s ease`,
  };

  const otherStyles = {
    height: `${displaySize.height}`,
    width: `${displaySize.width}`,
  };

  return (
    <>
      <div
        style={{ ...otherStyles }}
        className={styles.carouselMain}
      >
        <CarouselArrows />
        <CarouselNavDots />
        <div className={styles.carouselInner} style={transition}>{carouselItems}</div>
      </div>
    </>
  );
}

function AnchorTagsForIds(props: { id: string }) {
  const { id } = props;

  return <div id={id}></div>;
}
