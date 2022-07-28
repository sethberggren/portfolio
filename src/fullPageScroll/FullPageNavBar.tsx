import React, { useEffect, useCallback, useState } from "react";
import DrawerButton from "./DrawerButton";
import { useFullPageContext, useFullPageDispatch } from "./FullPageContext";
import styles from "./fullPageScroll.module.scss";

export type FullPageNavBarProps = {
  heightPercentage: number;
  children: React.ReactElement | React.ReactElement[];
} & JSX.IntrinsicElements["nav"];

const minNavBarHeight = 60;

export function FullPageNavBar(props: FullPageNavBarProps) {
  const { heightPercentage, children, className, ...rest } = props;

  const [buttonChildren, setButtonChildren] = useState<JSX.Element[]>([]);
  const [navBarHeader, setNavBarHeader] = useState<JSX.Element>();

  const { viewport, navBarHeight, drawerIsOpen } = useFullPageContext();
  const dispatch = useFullPageDispatch();

  useEffect(() => {
    const newButtonChildren: JSX.Element[] = [];

    const numOfNavBarTitles = 0;

    React.Children.forEach(children, (child: JSX.Element) => {
      if (!child.type) {
        throw new Error(
          "Can only use FullPageNavButton and FullPageNavBarTitle as child components for the FullPageNavBar component."
        );
      }

      if (child.type === FullPageNavButton) {
        newButtonChildren.push(child);
      }

      if (child.type === FullPageNavBarTitle) {
        if (numOfNavBarTitles === 0) {
          setNavBarHeader(child);
        } else {
          throw new Error("Can only have one nav bar header.");
        }
      }

      if (
        child.type !== FullPageNavButton &&
        child.type !== FullPageNavBarTitle
      ) {
        console.log(child);
        throw new Error(
          "Can only use FullPageNavButton and FullPageNavBarTitle as child components for the FullPageNavBar component."
        );
      }
    });

    setButtonChildren(newButtonChildren);
  }, [children]);

  useEffect(() => {
    const navBarHeight = (heightPercentage / 100) * viewport.height;

    if (navBarHeight > minNavBarHeight) {
      dispatch({
        type: "setNavBarHeight",
        payload: navBarHeight,
      });
    } else {
      dispatch({
        type: "setNavBarHeight",
        payload: minNavBarHeight,
      });
    }
  }, [heightPercentage, viewport, dispatch]);

  useEffect(() => {
    dispatch({ type: "setHasNavBar", payload: true });
  }, [dispatch]);

  useEffect(() => {
    if (viewport.height > 768) {
      dispatch({ type: "setDrawerIsOpen", payload: false });
    }
  }, [viewport, dispatch]);

  const toggleDrawer = useCallback(() => {
    if (drawerIsOpen) {
      dispatch({ type: "setDrawerIsOpen", payload: false });
    } else {
      dispatch({ type: "setDrawerIsOpen", payload: true });
    }
  }, [drawerIsOpen, dispatch]);

  const hiddenDrawerStyles = {
    top: `-${viewport.height}px`,
  };

  const visibleDrawerStyles = {
    top: `0px`,
  };

  return (
    <nav
      style={{ height: `${navBarHeight}px`, width: "100%" }}
      className={`${styles.fullPageNavBar} ${className}`}
      {...rest}
    >
      {navBarHeader}

      <div className={styles.fullPageNavBarButtonContainer}>
        {buttonChildren}
      </div>
      <DrawerButton toggleDrawer={toggleDrawer} />
      <div
        aria-label={`Navigation drawer`}
        className={styles.fullPageNavDrawer}
        style={drawerIsOpen ? visibleDrawerStyles : hiddenDrawerStyles}
      >
        <div>{buttonChildren}</div>
      </div>
    </nav>
  );
}

export type FullPageNavButtonProps = {
  children: JSX.Element | JSX.Element[];
  linkingId: string;
} & React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export function FullPageNavButton(props: FullPageNavButtonProps) {
  const { children, linkingId, className, ...rest } = props;

  const dispatch = useFullPageDispatch();

  const clickHandler = useCallback(() => {
    dispatch({ type: "setDrawerIsOpen", payload: false });
    dispatch({ type: "setIndexFromId", payload: linkingId });
  }, [dispatch]);

  return (
    <a
      href={`#${linkingId}`}
      onClick={clickHandler}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}

export type FullPageNavBarTitle = {
  children: React.ReactNode[];
} & JSX.IntrinsicElements["div"];

export function FullPageNavBarTitle(props: FullPageNavBarTitle) {
  const { children } = props;

  return <div className={styles.fullPageNavBarHeader}>{children}</div>;
}
