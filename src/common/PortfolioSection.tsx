import SectionHeading from "./SectionHeading";
import styles from "./common.module.scss";

type PortfolioSectionProps = {
  children: JSX.Element | JSX.Element[];
  backgroundColor: "primary" | "accent";
  sectionTitle: string;
};

export default function PortfolioSection(props: PortfolioSectionProps) {
  const { sectionTitle, children, backgroundColor } = props;

  return (
    <div
      className={`${styles.portfolioSection} ${
        backgroundColor === "primary" ? styles.primary : styles.accent
      }`}>
      <SectionHeading title={sectionTitle} />

      <div className={styles.portfolioSectionContent}>{children}</div>
    </div>
  );
}
