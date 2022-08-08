import { betweenSectionRange, inArrRange } from "./helperFunctions";

describe("inArrRange tests", () => {
  const testNum = 1000;
  const testArr = [0, 844, 1668, 2532];

  it("should calculate the correct value for values not on the boundary between two numbers", () => {
    expect(inArrRange(testArr, testNum, "lower")).toBe(2);
  });

  it("should calculate the correct value for a value on the lower bound", () => {
    const newTestNum = 1668;

    expect(inArrRange(testArr, newTestNum, "lower")).toBe(3);
  });

  it("should calculate the correct value for a value on the upper bound", () => {
    const newTestNum = 1668;

    expect(inArrRange(testArr, newTestNum, "upper")).toBe(2);
  });
});

describe("betweenSectionRange tests", () => {
  const testIds = ["Welcome", "About", "Projects", "Contact"];
  const sectionDelims = {
    Welcome: {
      min: 0,
      max: 844,
    },
    About: {
      min: 844,
      max: 1668,
    },
    Projects: {
      min: 1668,
      max: 2532,
    },
    Contact: {
      min: 2532,
      max: 3376,
    },
  };

  const testBetweenSectionRange = (
    testNum: number,
    scrollDirection: "up" | "down"
  ) => betweenSectionRange(testIds, sectionDelims, testNum, scrollDirection);

  it("should calculate the correct value for values not on the boundary between min and max when scrolling down", () => {
    expect(testBetweenSectionRange(500, "down")).toBe("Welcome");
    expect(testBetweenSectionRange(1000, "down")).toBe("About");
    expect(testBetweenSectionRange(2400, "down")).toBe("Projects");
  });

  it("should calculate the correct value for values not on the boundary between min and max when scrolling up", () => {
    expect(testBetweenSectionRange(500, "up")).toBe("About");
    expect(testBetweenSectionRange(1000, "up")).toBe("Projects");
    expect(testBetweenSectionRange(2400, "up")).toBe("Contact");
  });

  it("should calculate the correct value for values on the boundary when scrolling down", () => {
    expect(testBetweenSectionRange(0, "down")).toBe("Welcome");
    expect(testBetweenSectionRange(844, "down")).toBe("About");
    expect(testBetweenSectionRange(1668, "down")).toBe("Projects");
    expect(testBetweenSectionRange(2532, "down")).toBe("Contact");
  });

  it("should calculate the correct value for values on the boundary when scrolling up", () => {
    expect(testBetweenSectionRange(844, "up")).toBe("About");
    expect(testBetweenSectionRange(1668, "up")).toBe("Projects");
    expect(testBetweenSectionRange(2532, "up")).toBe("Contact");
  })
});
