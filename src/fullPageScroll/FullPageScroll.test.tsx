import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FullPageScroll from "./FullPageScroll";
import { FullPageNavBar, FullPageNavButton } from "./FullPageNavBar";
import { FullPageNavDots } from "./FullPageNavDots";
import { FullPageContent } from "./FullPageContent";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";


// setup testing elements

const idsAndDisplay: { id: string; display: string }[] = [
  { id: "slide1", display: "Slide 1 Panel" },
  { id: "slide2", display: "Slide 2 Panel" },
  { id: "slide3", display: "Slide 3 Panel" },
];

const slides: { id: string; jsx: JSX.Element }[] = idsAndDisplay.map((id) => {
  return { id: id.id, jsx: <h1>{id.display}</h1> };
});

const heightPercentage = 10;

const testFullPageScroll = (
  <FullPageScroll>
    <FullPageNavBar heightPercentage={heightPercentage}>
        {idsAndDisplay.map((id) => (
          <FullPageNavButton linkingId={id.id} key={`navButton-${id.id}`}>
            <p>{`Take me to ${id.id}`}</p>
          </FullPageNavButton>
        ))}
    </FullPageNavBar>

    <FullPageNavDots location="right" />

    {slides.map((slide, index) => (
      <FullPageContent referenceId={slide.id} index={index} key={`fullPageContent-${index}`}>
        {slide.jsx}
      </FullPageContent>
    ))}
  </FullPageScroll>
);

// helper functions to be used in the tests

const resize = (amount: number) => {
  fireEvent.resize(window, {target: {innerHeight: amount}});
};

const testScroll = (index: number) => {
  expect(screen.getByText(idsAndDisplay[0].display).parentElement?.parentElement).toHaveStyle(`transform: translate3d(0px, -${index*window.innerHeight}px, 0px)`);
}

const navigationDrawerVisibility = (visible: boolean) => {
  if (!visible) {
    expect(screen.getByLabelText(`Navigation drawer`)).toHaveStyle(`top: -${window.innerHeight}px`);
  } else {
    expect(screen.getByLabelText(`Navigation drawer`)).toHaveStyle(`top: 0px`);
  }
};

describe("Full Page Scroll Tests", () => {
  let container: HTMLDivElement | null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      fireEvent.resize(window, {target: {innerHeight: 768}});
      container = null;
    }
  });

  const renderFullPageScroll = () => {
    act(() => {
      render(testFullPageScroll, container as any);
    });
  };

  it("should render each slide in a full page container", () => {
    renderFullPageScroll();

    for (let i = 0; i < idsAndDisplay.length; i++) {
      const id = idsAndDisplay[i];
      const panel = screen.getByText(id.display).parentElement;
      expect(panel).toHaveClass("fullPageElement");

      if (i === 0) {
        expect(panel).toHaveStyle(
          `height: ${window.innerHeight * (1 - heightPercentage / 100)}px`
        );
        
      } else {
        expect(panel).toHaveStyle(`height: ${window.innerHeight}px`);
      }
    }
  });

  it("should change the height of the full page container on window resize", () => {
    renderFullPageScroll();

    resize(1000);

    for (let i = 0; i < idsAndDisplay.length; i++) {
      const id = idsAndDisplay[i];
      const panel = screen.getByText(id.display).parentElement;
      expect(panel).toHaveClass("fullPageElement");

      if (i === 0) {
        expect(panel).toHaveStyle(
          `height: ${window.innerHeight * (1 - heightPercentage / 100)}px`
        );
      } else {
        expect(panel).toHaveStyle(`height: ${window.innerHeight}px`);
      }
    }
  });

  it("should render anchor tages with the reference ids", () => {
    renderFullPageScroll();

    for (let i = 0; i < idsAndDisplay.length; i++) {
        const id = idsAndDisplay[i];
        expect(document.querySelector(`a[id=${id.id}]`)).toBeInTheDocument();
    }
  });

  it("should take the user to the section specified by clicking the navigation header buttons", () => {

    renderFullPageScroll();

    for (let i = 0; i < idsAndDisplay.length; i++) {

        const id = idsAndDisplay[i];
        act(() => {
            const buttons = screen.getAllByText(`Take me to ${idsAndDisplay[i].id}`);
            buttons[0].click();
        });
    
        testScroll(i);
        expect(window.location.hash).toBe(`#${id.id}`)
    }
  });

  it("should take the user to the section specified by clicking the navigation dots", () => {

    renderFullPageScroll();

    for (let i = 0; i < idsAndDisplay.length; i++) {
        const id = idsAndDisplay[i];

        act(() => {
            screen.getByLabelText(`Link to ${id.id} section.`).click();
        });

        testScroll(i);
        expect(window.location.hash).toBe(`#${id.id}`)
    }
  });

  it("should show the navigation drawer when the screen size is medium or smaller", () => {

    renderFullPageScroll();
    resize(1000);
    navigationDrawerVisibility(false);


    resize(500);

    act(() => {
      screen.getByLabelText("Open navigation drawer").click();
    });

    navigationDrawerVisibility(true);

    expect(screen.getByLabelText("Close navigation drawer")).toBeInTheDocument();

    act(() => {
      screen.getByLabelText("Close navigation drawer").click();
    })

    expect(screen.getByLabelText("Open navigation drawer")).toBeInTheDocument();
  });

  it("should automatically close the navigation drawer when a button in the navigation drawer is clicked", () => {

    renderFullPageScroll();

    resize(500);

    act(() => {
      screen.getByLabelText("Open navigation drawer").click();
    })

    navigationDrawerVisibility(true);

    act(() => {
      screen.getAllByText(`Take me to ${idsAndDisplay[0].id}`)[1].click();
    });

    navigationDrawerVisibility(false);
  });

  it("should automatically close the navigation drawer when the window is resized to be larger than 768 px", () => {

    renderFullPageScroll();
    resize(500);

    act(() => {
      screen.getByLabelText("Open navigation drawer").click();
    });

    navigationDrawerVisibility(true);

    resize(1000);

    navigationDrawerVisibility(false);

  })
});
