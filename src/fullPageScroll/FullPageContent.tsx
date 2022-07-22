import styles from "./fullPageScroll.module.scss";

export type FullPageContentProps = {
  children: React.ReactNode;
  id: string;
};

export function FullPageContent(props: FullPageContentProps) {
  const { children, id } = props;

  return (
    <div className={styles.fullPageElement} id={id}>
      {children}
    </div>
  );
}
