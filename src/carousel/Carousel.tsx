import React, { useEffect, useCallback, useState, useRef } from "react";
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
  const { displaySize, scrollTiming: customScrollTiming, children } = props;

  const { indexInView, scrollTiming } = useCarouselContext();
  const dispatch = useCarouselDispatch();

  const [carouselItems, setCarouselItems] = useState<JSX.Element[]>([]);

  const arrowButtonRef = useRef<HTMLButtonElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const navDotsRef = useRef<HTMLDivElement>(null);

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

  const getArrowWidth = () => {

    const minWidth = 24;

    const widthPercent = 0.05;

    const carouselContainerWidth = carouselContainerRef.current?.clientWidth;

    if (carouselContainerWidth !== undefined) {
      const computedWidthPercent = widthPercent * carouselContainerWidth;

      if (computedWidthPercent > minWidth) {
        return computedWidthPercent;
      } else {
        return minWidth;
      }
    } else {
      throw new Error("Carousel container does not exist.");
    }
  };

  const getCarouselItemDimensions = (
    carouselContainer: { height: number; width: number },
    navDotsContainer: HTMLDivElement
  ) => {
    const newArrowWidth = getArrowWidth();

    const carouselNavDotsBottom = pixelStringToNumber(
      getComputedStyle(navDotsContainer).bottom
    );
    const carouselNavDotsHeight =
      pixelStringToNumber(getComputedStyle(navDotsContainer).height) === 0
        ? 31
        : pixelStringToNumber(getComputedStyle(navDotsContainer).height);

    if (carouselContainer.width !== undefined) {
      const carouselItemWidth = carouselContainer.width - 2 * newArrowWidth;
      const carouselItemHeight =
        carouselContainer.height -
        2 * carouselNavDotsBottom -
        carouselNavDotsHeight;

      return { height: carouselItemHeight, width: carouselItemWidth };
    } else {
      throw new Error("Carousel container does not exist.");
    }
  }

  const handleResize = useCallback(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const newArrowWidth = getArrowWidth();

      const carouselContainer = {
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height,
      };

      const carouselItemDimensions = getCarouselItemDimensions(
        carouselContainer,
        navDotsRef.current as HTMLDivElement
      );

      dispatch({
        type: "setCarouselItemDimensions",
        payload: carouselItemDimensions,
      });
      dispatch({ type: "setArrowWidth", payload: newArrowWidth });
    });

    return resizeObserver;
  }, [dispatch, getCarouselItemDimensions, getArrowWidth]);

  useEffect(() => {
    const initialSizes = () => {
      if (carouselContainerRef.current) {
        const carouselContainer = {
          height: carouselContainerRef.current.clientHeight,
          width: carouselContainerRef.current.clientWidth,
        };

        dispatch({
          type: "setCarouselItemDimensions",
          payload: getCarouselItemDimensions(
            carouselContainer,
            navDotsRef.current as HTMLDivElement
          ),
        });

        dispatch({ type: "setArrowWidth", payload: getArrowWidth() });
      }
    };

    initialSizes();
    handleResize().observe(carouselContainerRef.current as HTMLDivElement);

    return () =>
      handleResize().unobserve(carouselContainerRef.current as HTMLDivElement);
  }, []);

  const transition = {
    transform: `translateX(-${indexInView * 100}%)`,
    transition: `transform ${scrollTiming / 1000}s ease`,
  };

  const carouselContainerDimensions = {
    height: `${displaySize.height}`,
    width: `${displaySize.width}`,
  };

  return (
    <>
      <div
        style={{ ...carouselContainerDimensions }}
        className={styles.carouselMain}
        ref={carouselContainerRef}
      >
        <CarouselArrows ref={arrowButtonRef} />
        <CarouselNavDots ref={navDotsRef} />
        <div className={styles.carouselInner} style={transition}>
          {carouselItems}
        </div>
      </div>
    </>
  );
}

function pixelStringToNumber(pixelString: string) {
  const splitString = pixelString.split("px");

  const pixelNumber = parseFloat(splitString[0]);

  if (isNaN(pixelNumber)) {
    throw new Error("Error, cannot convert pixel string to number");
  }

  return pixelNumber;
}
