import { useEffect, useState } from "react";
import {
  checkContext,
  checkDispatch,
  useFullPageContext,
  useFullPageDispatch,
} from "./FullPageContext";
import styles from "./fullPageScroll.module.scss";

export type FullPageContentProps = {
  index: number;
  children: React.ReactNode;
  id: string;
};

export function FullPageContent(props: FullPageContentProps) {
  const { children, id, index } = props;

  const dispatch = checkDispatch(useFullPageDispatch());
  const { hasNavBar, viewport, navBarHeight } = checkContext(
    useFullPageContext()
  );

  const [contentHeight, setContentHeight] = useState(viewport.height);

  useEffect(() => {
    dispatch({ type: "addId", payload: { id: id, index: index } });
  }, [id, dispatch]);

  useEffect(() => {

    let newHeight = 0;

    if (index === 0 && hasNavBar) {
        newHeight = viewport.height - navBarHeight;
    } else {
        newHeight = viewport.height;
    }

    console.log("Here's the new height" + newHeight);
    setContentHeight(newHeight);

  }, [index, viewport, hasNavBar, navBarHeight, dispatch])

  const fullPageId = `fullPage-${id}`;

  return (
    <div
      className={styles.fullPageElement}
      id={fullPageId}
      style={{ height: `${contentHeight}px` }}
    >
      {children}
    </div>
  );
}
