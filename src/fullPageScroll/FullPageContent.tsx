import { useEffect, useRef, useState } from "react";
import {
  useFullPageContext,
  useFullPageDispatch,
} from "./FullPageContext";
import styles from "./fullPageScroll.module.scss";

export type FullPageContentProps = {
  index: number;
  children: React.ReactNode;
  referenceId: string;
};

export function FullPageContent(props: FullPageContentProps) {
  const { children, referenceId, index } = props;

  const currPageRef = useRef<HTMLDivElement>(null);

  const dispatch = useFullPageDispatch();
  const { hasNavBar, viewport, navBarHeight, indexInView } = useFullPageContext();

  const [contentHeight, setContentHeight] = useState(viewport.height);

  useEffect(() => {
    dispatch({ type: "addId", payload: { id: referenceId, index: index } });
  }, [referenceId, dispatch]);

  useEffect(() => {
    let newHeight = 0;

    if (index === 0 && hasNavBar) {
      newHeight = viewport.height - navBarHeight;
    } else {
      newHeight = viewport.height;
    }

    setContentHeight(newHeight);
  }, [index, viewport, hasNavBar, navBarHeight, dispatch]);

  useEffect(() => {
    if (currPageRef.current && index === indexInView) {
      currPageRef.current.focus();
    }
  }, [indexInView]);

  const fullPageId = `fullPage-${referenceId}`;

  return (
    <div
      className={styles.fullPageElement}
      id={fullPageId}
      style={{ height: `${contentHeight}px` }}
      ref={currPageRef}
    >
      {children}
    </div>
  );
}
