import globalStyles from "../App.module.scss";
import appRoutes from "../routes";
import styles from "./about.module.scss";
import profile from "./profile.jpg";
import js from "./js.svg";
import ts from "./ts.svg";
import node from "./node.svg";
import jest from "./jest.svg";
import mySql from "./mySQL.svg";
import expressJs from "./expressJs.svg";
import react from "./react.svg";
import digitalOcean from "./digitalOcean.svg";
import SectionHeading from "../SectionHeading";

const techonlogyLogos: TechnologyIconProps[] = [
  { src: js, displayName: "JavaScript" },
  { src: ts, displayName: "TypeScript" },
  { src: react, displayName: "React" },
  { src: node, displayName: "Node.js" },
  { src: jest, displayName: "Jest" },
  { src: expressJs, displayName: "Express JS" },
  { src: mySql, displayName: "MySQL" },
  { src: digitalOcean, displayName: "DigitalOcean" },
];

export default function About() {
  return (
    <div className={styles.aboutContainer}>
      <SectionHeading title="About Me"/>

      <div className={styles.aboutMain}>
        <div className={styles.aboutProfilePicture}>
          <img src={profile} alt="A picture of Seth Berggren."></img>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.aboutDetails}>
          <p className={styles.aboutText}>
            I taught secondary math for 5 years in public schools before
            transitioning into full-stack web development. I'm all about
            leveraging technology to make the boring tasks a breeze.
            <br></br> <br></br>
            Huge fan of TypeScript everywhere - frontend and backend.
          </p>
        </div>
      </div>

      <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%"}}>
        <div className={styles.aboutTechnologyLogoContainer}>
          <p id={styles.logoContainerDescription}>Web Technologies I ❤️</p>

          <div id={styles.logos}>
            {techonlogyLogos.map((logo) => (
              <TechnlogyIcon src={logo.src} displayName={logo.displayName} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

type TechnologyIconProps = {
  src: string;
  displayName: string;
};
function TechnlogyIcon(props: TechnologyIconProps) {
  const { src, displayName } = props;

  return (
    <img
      src={src}
      alt={displayName}
      className={styles.technologyLogo}
      title={displayName}
    ></img>
  );
}
