import { ReactComponentElement } from "react";
import styles from "./common.module.scss";

type ButtonLinkProps = {
  href: string;
  icon: JSX.Element;
  color: "primary" | "accent";
};

export default function ButtonLink(props: ButtonLinkProps) {
  const { href, icon, color } = props;

  return (
    <a
      href={href}
      className={
        color === "primary"
          ? styles.externalButtonPrimary
          : styles.externalButtonAccent
      }
      target="_blank"
      rel="noreferrer noopener"
    >
      {icon}
    </a>
  );
}
