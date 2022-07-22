import globalStyles from "../App.module.scss";
import appRoutes from "../routes";
import styles from "./about.module.scss";

export default function About() {
  return (
    <div className={styles.aboutContainer}>
      <h3 className={globalStyles.sectionHeading}>About Me</h3>
    </div>
  );
}
