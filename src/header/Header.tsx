import styles from "./header.module.scss";
import { ReactComponent as IcebergLogo } from "../waves/iceberg.svg";
import appRoutes from "../routes";
import { FullPageNavButton } from "../fullPageScroll/FullPageNavBar";

export default function Header() {
  return (
    <div className={styles.header}>
      <HeaderMain />

      <HeaderButtons />
    </div>
  );
}

function HeaderMain() {
  return (
    <div className={styles.headerMainContainer}>
      <IcebergLogo className={styles.headerIceberg} />

      <h1 className={styles.headerText}>Iceberggren</h1>
    </div>
  );
}

type HeaderButton = {
  display: string;
  link: keyof typeof appRoutes;
};

const headerButtons: HeaderButton[] = [
  { display: "About", link: "about" },
  { display: "Projects", link: "projects" },
  { display: "Contact", link: "contact" },
];

function HeaderButtons() {
  const renderedHeaderButtons = headerButtons.map((headerButton) => (
    <HeaderButton
      display={headerButton.display}
      link={headerButton.link}
    />
  ));

  return <div className={styles.headerButtons}>{renderedHeaderButtons}</div>;
}

function HeaderButton(props: HeaderButton) {
  const { display, link } = props;

  return (
    <FullPageNavButton
      linkingId={link}
      className={`${styles.headerButton} ${styles.headerText}`}
    >
      {display}
    </FullPageNavButton>
  );
}
