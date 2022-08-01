import styles from "./App.module.scss";

type SectionHeadingProps = {
  title: string;
};

export default function SectionHeading(props: SectionHeadingProps) {
  const { title } = props;
  return <h3 className={styles.sectionHeading}>{title}</h3>;
}
