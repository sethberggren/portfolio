import Carousel from "../carousel/Carousel";
import CarouselArrows from "../carousel/CarouselArrows";
import CarouselItem from "../carousel/CarouselItem";
import CarouselNavDots from "../carousel/CarouselNavDots";
import styles from "./projects.module.scss";

const projects: { id: string; jsx: JSX.Element }[] = [
  { id: "Gradezpr", jsx: <h3>Gradezpr</h3> },
  { id: "FullPageScroll", jsx: <h3>Full Page Scroll</h3> },
  { id: "ProblemGenerator", jsx: <h3>Problem Generator</h3> },
];

export default function Projects() {
  const renderedProjects = projects.map((project, index) => (
    <CarouselItem index={index} referenceId={project.id}>
      {project.jsx}
    </CarouselItem>
  )) as JSX.Element[];
  
  return (
    <div className={styles.projectsContainer}>
      <Carousel displaySize={{ height: "80%", width: "80%" }}>
        {renderedProjects}
      </Carousel>
    </div>
  );
}
