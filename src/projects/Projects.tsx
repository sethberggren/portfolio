import Carousel from "../carousel/Carousel";
import CarouselArrows from "../carousel/CarouselArrows";
import CarouselItem from "../carousel/CarouselItem";
import CarouselNavDots from "../carousel/CarouselNavDots";
import styles from "./projects.module.scss";
import { ReactComponent as ExternalLinkLogo } from "../icons/externalLink.svg";
import { ReactComponent as GithubLogo } from "../icons/github.svg";
import ButtonLink from "../common/ButtonLink";
import PortfolioSection from "../common/PortfolioSection";

const gradezprDescription = (
  <p>
    Gradezpr is a tool I built to help simplify the grade import process for my
    school's Learning Management System (LMS), PowerSchool. <br></br> <br></br>
    Gradezpr was designed to resolve the mismatch of a student's name on auto-graded assignments and in the gradebook by using the student's ID as a
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
    name: "Portfolio",
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
    <PortfolioSection sectionTitle="My Projects" backgroundColor="primary">
      <Carousel displaySize={{ height: "95%", width: "95%" }}>
        {renderedProjects}
      </Carousel>
    </PortfolioSection>
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
