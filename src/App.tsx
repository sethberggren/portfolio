import React from "react";
import logo from "./logo.svg";
import styles from "./App.module.scss";
import { ReactComponent as IcebergLogo } from "./waves/iceberg.svg";
import { Waves } from "./waves/Waves";
import FullPageScroll from "./fullPageScroll/FullPageScroll";
import About from "./about/About";
import { useEffect } from "react";
import { useGlobalDispatch } from "./state/globalContext";
import Projects from "./projects/Projects";
import {
  FullPageNavBar,
  FullPageNavBarTitle,
  FullPageNavButton,
} from "./fullPageScroll/FullPageNavBar";
import { FullPageContent } from "./fullPageScroll/FullPageContent";
import { FullPageNavDots } from "./fullPageScroll/FullPageNavDots";
import appRoutes from "./routes";
import headerStyles from "./header/header.module.scss";
import Contact from "./contact/Contact";

export type FullPageElements = {
  jsx: JSX.Element;
  id: keyof typeof appRoutes;
}[];

type HeaderButton = {
  display: string;
  link: keyof typeof appRoutes;
};

const headerButtons: HeaderButton[] = [
  { display: "About", link: "about" },
  { display: "Projects", link: "projects" },
  { display: "Contact", link: "contact" },
];
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
    {
      id: "contact",
      jsx: <Contact />
    }
  ];

  const dispatchWindowChange = () => {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;

    dispatch({
      type: "setViewport",
      payload: { width: width, height: height },
    });
  };

  useEffect(() => {
    window.addEventListener("resize", () => dispatchWindowChange());

    return window.removeEventListener("resize", () => dispatchWindowChange());
  }, []);

  const renderedHeaderButtons = headerButtons.map((button) => {
    return (
      <FullPageNavButton
        linkingId={button.link}
        key={`full-page-nav-button-${button.link}`}
        className={headerStyles.headerButton}
      >
        <p>{button.display}</p>
      </FullPageNavButton>
    );
  });

  const renderedContent = fullPageElements.map((element, index) => (
    <FullPageContent referenceId={element.id} index={index}>
      {element.jsx}
    </FullPageContent>
  )) as React.ReactElement<any>[];

  return (
    <>
      <FullPageScroll customScrollTiming={1500}>
        <FullPageNavBar className={headerStyles.header} heightPercentage={10}>
          <FullPageNavBarTitle>
            <IcebergLogo className={headerStyles.headerIceberg} />

            <h1 className={headerStyles.headerText}>Iceberggren</h1>
          </FullPageNavBarTitle>

          {renderedHeaderButtons as any}
        </FullPageNavBar>

        {renderedContent}
      </FullPageScroll>
    </>
  );
}

export default App;
