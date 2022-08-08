import { ObjectTyped } from "object-typed";

export function betweenSectionRange(
  ids: string[],
  sectionDelims: { [key: string]: { min: number; max: number } },
  testNum: number,
  scrollDirection: "up" | "down"
): string {
  const sectionThresholds: number[] = [];

  for (const key of ObjectTyped.keys(sectionDelims)) {
    const { min, max } = sectionDelims[key];

    if (scrollDirection === "down") {
      sectionThresholds.push(max);
    } else {
      sectionThresholds.push(min);
    }
  }

  const index = inArrRange(
    sectionThresholds,
    testNum,
    scrollDirection === "down" ? "lower" : "upper"
  );

  if (scrollDirection === "down") {
    return ids[index];
  } else {

    return ids[index];

  }
}
export function inArrRange(
  numArr: number[],
  testNum: number,
  lowerOrUpperInclusive: "lower" | "upper"
): number {
  // test if number is smaller than the first value

  if (lowerOrUpperInclusive === "lower") {
    if (testNum >= Number.NEGATIVE_INFINITY && testNum < numArr[0]) {
      return 0;
    }
  } else {
    if (testNum > Number.NEGATIVE_INFINITY && testNum <= numArr[0]) {
      return 0;
    }
  }

  for (let i = 0; i < numArr.length; i++) {
    const smallerNum = numArr[i];

    let largerNum = Number.POSITIVE_INFINITY;

    if (i + 1 !== numArr.length) {
      largerNum = numArr[i + 1];
    }

    if (lowerOrUpperInclusive === "lower") {
      if (testNum >= smallerNum && testNum < largerNum) {
        return i + 1;
      }
    } else {
      if (testNum > smallerNum && testNum <= largerNum) {
        return i + 1;
      }
    }
  }

  return numArr.length;
}
