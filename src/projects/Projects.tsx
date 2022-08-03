import Carousel from "../carousel/Carousel";
import CarouselArrows from "../carousel/CarouselArrows";
import CarouselItem from "../carousel/CarouselItem";
import CarouselNavDots from "../carousel/CarouselNavDots";
import SectionHeading from "../SectionHeading";
import styles from "./projects.module.scss";
import { ReactComponent as ExternalLinkLogo } from "../icons/externalLink.svg";
import { ReactComponent as GithubLogo } from "../icons/github.svg";
import ButtonLink from "../common/ButtonLink";

const gradezprDescription = (
  <p>
    Gradezpr is a tool I built to help simplify the grade import process for my
    school's Learning Management System (LMS), PowerSchool. <br /> <br /> When I
    gave assignments, many were 'auto-graded' assignments through Google Sheets.
    However, students were required to manually enter their names into Google
    Forms, sometimes resulting in a mismatch between what they wrote on Google
    Forms and what was in the LMS. For example, in the LMS the student is named
    Benjamin, but the student writes 'Ben' in on their Google Forms response.
    <br /> <br />
    Gradezpr was designed to rectify this issue by using the student's ID as a
    unique identifier for quicker LMS imports. <br></br> <br></br>It includes
    other features such as: curving student grades, summary statistics for an
    assignment, and importing grades into PowerSchool through a Chrome
    extension.
  </p>
);

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
  description: string | JSX.Element;
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
          <ButtonLink
            href={projectLink}
            icon={<ExternalLinkLogo />}
            color="accent"
          />
          <ButtonLink href={githubLink} icon={<GithubLogo />} color="accent" />
        </div>
      </div>

      <div className={styles.projectDivider}></div>

      <div className={styles.projectDetails}>
        <div className={styles.projectDescription}>{description}</div>
      </div>
    </div>
  );
}
