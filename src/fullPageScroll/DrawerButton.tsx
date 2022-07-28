import { useEffect } from "react";
import { useFullPageContext } from "./FullPageContext";
import styles from "./fullPageScroll.module.scss";

type DrawerButtonProps = {
  toggleDrawer: () => void;
};

export default function DrawerButton(props: DrawerButtonProps) {
  const { toggleDrawer } = props;

  const {drawerIsOpen} = useFullPageContext();


  return (
    <button
      onClick={toggleDrawer}
      className={`${styles.fullPageNavBarDrawerButton} ${styles.hamburger} ${styles["hamburger--stand"]} ${
        drawerIsOpen? styles["is-active"] : ""
      }`}
      type="button"
      aria-label={`${!drawerIsOpen ? "Open" : "Close"} navigation drawer`}
    >
      <span className={styles["hamburger-box"]}>
        <span className={styles["hamburger-inner"]} />
      </span>
    </button>
  );
}
