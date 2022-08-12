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
    Gradezpr was designed to resolve the mismatch of a student's name on
    auto-graded assignments and in the gradebook by using the student's ID as a
    unique identifier for quicker LMS imports. <br></br> <br></br>It includes
    other features such as: curving student grades, summary statistics for an
    assignment, and importing grades into PowerSchool through a Chrome
    extension.
  </p>
);

const iceberggrenDescription =
  "iceberggren.com is my portfolio website, designed to show off the projects I've been working on. You're seeing it right now.";

const expressErrorFactoryDescription = (
  <p>
    One of my absolute favorite feature of TypeScript is its ability to
    massively simplify the coding process through code completion. Granted, it
    does require a bit of upfront work in the sense of making sure everything is
    typed appropriately, but I think that work is well-spent.
    <br></br>
    <br></br>I wrote an NPM package, express-error-factory, with the awesome
    code-completion features of TypeScript in mind. I developed this package to
    solve a common error I was having in my Express apps. I needed to respond to
    errors thrown in the Express app environment, either due to incorrect
    requests or from errors happening in the code itself. Ultimately, this
    needed to happen in an end user-friendly way. After all, you don't want the
    end-user reading something nasty like a TypeError or something thrown as a
    response to your SQL query.
    <br></br>
    <br></br>
    express-error-factory was designed to generate errors in your Express app,
    with custom error types, subtypes, and messages. I'd love for you to check
    it out!
  </p>
);

const projects: ProjectProps[] = [
  {
    name: "Gradezpr",
    description: gradezprDescription,
    projectLink: "https://gradezpr.iceberggren.com",
    githubLink: "https://github.com/sethberggren/gradezpr-client",
  },
  {
    name: "Portfolio",
    description: iceberggrenDescription,
    projectLink: "https://www.iceberggren.com",
    githubLink: "https://github.com/sethberggren/portfolio",
  },
  {
    name: "express-error-factory",
    description: expressErrorFactoryDescription,
    projectLink: "https://www.npmjs.com/package/express-error-factory",
    githubLink: "https://github.com/sethberggren/express-error-factory",
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
