
import React, { useEffect, useCallback } from "react";
import {
  useFullPageContext,
  useFullPageDispatch,
} from "./FullPageContext";

export type FullPageTopBarProps = {
  heightPercentage: number;
  children: JSX.Element[] | JSX.Element;
  persistent?: boolean;
};

export function FullPageNavBar(props: FullPageTopBarProps) {
  const { heightPercentage, persistent, children } = props;

  const { viewport, navBarHeight } = useFullPageContext();
  const dispatch = useFullPageDispatch();

  useEffect(() => {
    dispatch({
      type: "setNavBarHeight",
      payload: heightPercentage/100 * viewport.height,
    });
  }, [heightPercentage, viewport, dispatch]);

  useEffect(() => {
    dispatch({ type: "setHasNavBar", payload: true });
  }, [dispatch]);

  return (
    <nav style={{ height: `${navBarHeight}px`, width: "100%" }}>{children}</nav>
  );
}

export type FullPageNavButtonProps = {
    children: React.ReactNode[] | React.ReactNode;
    linkingId: string;
} & React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>

export function FullPageNavButton(props: FullPageNavButtonProps) {
    const {children, linkingId, ...rest} = props;

    const dispatch = useFullPageDispatch();

    const clickHandler = useCallback(() => {
        dispatch({type: "setIndexFromId", payload: linkingId});
    }, [dispatch]);

    return <a href={`#${linkingId}`} onClick={clickHandler} {...rest}>
        {children}
    </a>
}