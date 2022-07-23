import { useEffect } from "react";
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

  useEffect(() => {
    dispatch({ type: "addId", payload: { id: id, index: index } });
  }, [id, dispatch]);

  let height = viewport.height;

  if (index === 0 && hasNavBar) {
    height = viewport.height - navBarHeight;
  }

  const fullPageId = `fullPage-${id}`;

  return (
    <div
      className={styles.fullPageElement}
      id={fullPageId}
      style={{ height: `${height}px` }}
    >
      {children}
    </div>
  );
}
