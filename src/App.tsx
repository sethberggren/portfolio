import React from "react";
import logo from "./logo.svg";
import styles from "./App.module.scss";
import Header from "./header/Header";
import { Waves } from "./waves/Waves";
import FullPageScroll, {
  FullPageElements,
} from "./fullPageScroll/FullPageScroll";
import About from "./about/About";
import { useEffect } from "react";
import { useGlobalDispatch } from "./state/globalContext";
import Projects from "./projects/Projects";
import FullPageProvider from "./fullPageScroll/FullPageProvider";
import { FullPageNavBar } from "./fullPageScroll/FullPageNavBar";
import { FullPageContent } from "./fullPageScroll/FullPageContent";
import { FullPageNavDots } from "./fullPageScroll/FullPageNavDots";

function App() {
  const dispatch = useGlobalDispatch();

  const fullPageElements: FullPageElements = [
    {
      id: "welcome",
      jsx: (
          <Waves />
      ),
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

    dispatch({
      type: "setViewport",
      payload: { width: width, height: height },
    });
  };

  useEffect(() => {
    window.addEventListener("resize", () => dispatchWindowChange());

    return window.removeEventListener("resize", () => dispatchWindowChange());
  }, []);

  const renderedContent = fullPageElements.map((element, index) => <FullPageContent id = {element.id} index={index}>{element.jsx}</FullPageContent>) as React.ReactElement<any>[];

  return (
    <>
    <FullPageProvider>
    <FullPageScroll> 
      <FullPageNavBar heightPercentage={10}>
        <Header />
      </FullPageNavBar>

      <FullPageNavDots location="right" />

      {renderedContent}



    </FullPageScroll>
    </FullPageProvider>
     
    </>
  );
}

export default App;
