import React from "react";
import logo from "./logo.svg";
import styles from "./App.module.scss";
import Header from "./header/Header";
import { Waves } from "./waves/Waves";
import FullPageScroll from "./fullPageScroll/FullPageScroll";
import About from "./about/About";
import { useEffect } from "react";
import { useGlobalDispatch } from "./state/globalContext";
import Projects from "./projects/Projects";
import { FullPageNavBar } from "./fullPageScroll/FullPageNavBar";
import { FullPageContent } from "./fullPageScroll/FullPageContent";
import { FullPageNavDots } from "./fullPageScroll/FullPageNavDots";
import appRoutes from "./routes";

export type FullPageElements = {
  jsx: JSX.Element;
  id: keyof typeof appRoutes;
}[];

function App() {
  const dispatch = useGlobalDispatch();

  const fullPageElements: FullPageElements = [
    {
      id: "welcome",
      jsx: <Waves />,
    },
    {
      id: "about",
      jsx: <About />,
    },
    {
      id: "projects",
      jsx: <Projects />,
    },
  ];

  const dispatchWindowChange = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    console.log("resize from app.tsx payload event listnerr...");

    dispatch({
      type: "setViewport",
      payload: { width: width, height: height },
    });
  };

  useEffect(() => {
    window.addEventListener("resize", () => dispatchWindowChange());

    return window.removeEventListener("resize", () => dispatchWindowChange());
  }, []);

  const renderedContent = fullPageElements.map((element, index) => (
    <FullPageContent referenceId={element.id} index={index}>
      {element.jsx}
    </FullPageContent>
  )) as React.ReactElement<any>[];

  return (
    <>
      <FullPageScroll>
        <FullPageNavBar heightPercentage={10}>
          <Header />
        </FullPageNavBar>

        <FullPageNavDots location="right" />
        {renderedContent}
      </FullPageScroll>
    </>
  );
}

export default App;
