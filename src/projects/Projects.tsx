import Carousel from "../carousel/Carousel";
import CarouselArrows from "../carousel/CarouselArrows";
import CarouselItem from "../carousel/CarouselItem";
import CarouselNavDots from "../carousel/CarouselNavDots";
import SectionHeading from "../SectionHeading";
import styles from "./projects.module.scss";

const gradezprDescription =
  "Gradezpr is a tool I built to help me simplify the grade import process for my school's Learning Management System (LMS), PowerSchool. When I gave assignments, many were 'auto-graded' assignments through Google Sheets.  However, students were required to manually enter their names into Google Forms, sometimes resulting in a mismatch between what they wrote on Google Forms and what was in the LMS.  For example, in the LMS the student is named Benjamin, but the student writes 'Ben' in on their Google Forms response.  Gradezpr was designed to rectify this issue by using the student's ID as a unique identifier.  It includes other features such as: curving student grades, seeing summary statistics for an assignment, and importing grades into PowerSchool through a Chrome extension.";

const iceberggrenDescription =
  "iceberggren.com is my portfolio website, designed to show off the projects I've been working on. You're seeing it right now.";

const projects: ProjectProps[] = [
  {
    name: "Gradezpr",
    description: gradezprDescription,
    projectLink: "https://www.iceberggren.com/gradezpr",
    githubLink: "https://www.github.com",
  },
  {
    name: "iceberggren.com",
    description: iceberggrenDescription,
    projectLink: "https://www.iceberggren.com",
    githubLink: "https://www.github.com",
  },
];

export default function Projects() {
  const renderedProjects = projects.map((project, index) => (
    <CarouselItem index={index} referenceId={project.name} key={project.name}>
      <Project {...project} />
    </CarouselItem>
  )) as JSX.Element[];

  return (
    <div className={styles.projectsContainer}>
      <SectionHeading title="My Projects" />
      <Carousel displaySize={{ height: "80%", width: "90%" }}>
        {renderedProjects}
      </Carousel>
    </div>
  );
}

type ProjectProps = {
  name: string;
  description: string;
  githubLink: string;
  projectLink: string;
};

function Project(props: ProjectProps) {
  const { name, description, githubLink, projectLink } = props;

  return (
    <div className={styles.projectContainer}>
      <div className={styles.projectNameAndButtons}>
        <h4 className={styles.projectName}>{name}</h4>

        <div className={styles.projectButtons}>
          <a
            href={projectLink}
            className={styles.projectButton}
            target="_blank"
            rel="noreferrer noopener"
          ></a>
          <a
            href={githubLink}
            className={styles.projectButton}
            target="_blank"
            rel="noreferrer noopener"
          ></a>
        </div>
      </div>

      <div className={styles.projectDivider}></div>

      <div className={styles.projectDetails}>
        <p className={styles.projectDescription}>{description}</p>
      </div>
    </div>
  );
}
