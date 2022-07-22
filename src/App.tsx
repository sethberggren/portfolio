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

function App() {
  const dispatch = useGlobalDispatch();

  const fullPageElements: FullPageElements = [
    {
      id: "welcome",
      jsx: (
        <div id={"welcome"}>
          {" "}
          <Header />
          <Waves />
        </div>
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

  return (
    <>
      <FullPageScroll elements={fullPageElements} />
    </>
  );
}

export default App;
