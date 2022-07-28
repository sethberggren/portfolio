import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Carousel from "./Carousel";
import CarouselItem from "./CarouselItem";

const idsAndDisplay: { id: string; display: string }[] = [
    { id: "slide1", display: "Slide 1 Panel" },
    { id: "slide2", display: "Slide 2 Panel" },
    { id: "slide3", display: "Slide 3 Panel" },
  ];
  
  const slides: { id: string; jsx: JSX.Element }[] = idsAndDisplay.map((id) => {
    return { id: id.id, jsx: <h1>{id.display}</h1> };
  });

  const testCarouselDisplaySize = {height: "10rem", width: "10rem"};

  const testCarousel = <Carousel displaySize={{height: "10rem", width: "10rem"}}>
    {slides.map((slide, index) => <CarouselItem index={index} referenceId={slide.id} key={`carousel-item-${slide.id}`}>{slide.jsx}</CarouselItem>)}
  </Carousel>

describe("Tests of Carousel Component", () => {
    let container: HTMLDivElement | null;
    let carouselWindow : HTMLElement | null | undefined;
    let innerDiv: HTMLElement | null | undefined;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });
  
    afterEach(() => {
      if (container) {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
      }
    });

    const renderCarousel = () => {
        act(() => {
          render(testCarousel, container as any);
        });

        carouselWindow = screen.getByText(idsAndDisplay[0].display).parentElement?.parentElement?.parentElement;
        innerDiv = screen.getByText(idsAndDisplay[0].display).parentElement?.parentElement;
      };

    it("should render the component with height and width specified by the user", () => {
        renderCarousel();

        expect(carouselWindow).toHaveStyle(`height: ${testCarouselDisplaySize.height}; width: ${testCarouselDisplaySize.width}`);

        const expectedHeight = carouselWindow!.clientHeight;

        expect(innerDiv?.clientHeight).toBeCloseTo(expectedHeight);

        for (let i = 0; i < idsAndDisplay.length; i++) {
            const id = idsAndDisplay[i];

            expect(screen.getByText(id.display).parentElement?.clientHeight).toBeCloseTo(expectedHeight);
        }
    });  

    it("should transition to a new page if the left/right buttons are clicked", () => {
        renderCarousel();

        const leftButton = screen.getByLabelText("Move items left");
        const rightButton = screen.getByLabelText("Move items right");

        for (let i = 1; i < idsAndDisplay.length + 1; i++) {
            act(() => {
                rightButton.click();
            });

            if (i < idsAndDisplay.length) {
                expect(innerDiv).toHaveStyle(`transform: translateX(-${i*100}%)`);
            } else {
                expect(innerDiv).toHaveStyle(`transform: translateX(-${0}%)`)
            }
        }

        for (let i = idsAndDisplay.length - 1; i > -2; i--) {
            act(() => {
                leftButton.click();
            });


            if (i > -1) {
                expect(innerDiv).toHaveStyle(`transform: translateX(-${i*100}%)`);
            } else {
                expect(innerDiv).toHaveStyle(`transform: translateX(-200%)`);
            }
        }
    });

    it("should transition to a new page if the nav dots are clicked", () => {
        renderCarousel();

        for (let i = 1; i < idsAndDisplay.length; i++) {
            const id = idsAndDisplay[i];

            const navDot = screen.getByLabelText(`Link to ${id.id} section.`);

            act(() => {
                navDot.click();
            });

            expect(innerDiv).toHaveStyle(`transform: translateX(-${i*100}%)`);
        }
    });
})