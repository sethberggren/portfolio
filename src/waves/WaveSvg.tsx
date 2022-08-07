import { ObjectTyped } from "object-typed";
import CoordinateRange from "./CoordinateRange";
import { ReactComponent as Iceberg } from "./iceberg.svg";
import { WaveFunctions, WaveFunctionValueResponse } from "./Waves";
import styles from "./waves.module.scss";

export type WaveSVGProps = {
  waveValues: WaveFunctionValueResponse;
  viewport: { height: number; width: number };
};

export const waveFunctionTypes = ["xs", "sin", "cos"] as const;
type WaveFunctionColors = { [key in WaveFunctions]: string };
type WaveFunctionValues = { [key in WaveFunctions]: number[] };

const svgXPaddingPercentage = 0.5;

const backgroundColor = "#3e92cc";
const wavePathColors: WaveFunctionColors = {
  xs: "#000000",
  sin: "#16324f",
  cos: "#2a628f",
};

const waveOpacity = 0.75;
const yMin = -5;
const yMax = 2;

export default function WaveSvg(props: WaveSVGProps) {
  const { waveValues, viewport } = props;

  const { functionValues, params } = waveValues;
  const { xMin, xMax } = params;

  const svgWidth = viewport.width;
  const svgHeight = viewport.height;
  const svgXPadding = svgWidth * svgXPaddingPercentage;

  const xCoordinates = new CoordinateRange(xMin, xMax);
  const yCoordinates = new CoordinateRange(yMin, yMax);

  const svgXCoordinates = new CoordinateRange(0, svgWidth + svgXPadding);
  const svgYCoordinates = new CoordinateRange(0, svgHeight);

  const toSvgX = svgXCoordinates.toOwnCoordinateBasis(xCoordinates);
  const toSvgY = svgYCoordinates.toOwnCoordinateBasis(yCoordinates);

  const wavePaths = generateWavePaths(
    functionValues,
    { xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax },
    { toSvgX: toSvgX, toSvgY: toSvgY }
  );

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      height={svgHeight}
      width={svgWidth}
      className={styles.waveSvg}
    >
      <style>{svgCssAnimation((svgXPaddingPercentage * 100) / 4)}</style>

      <rect height="100%" width="100%" fill={backgroundColor}></rect>

      <Iceberg
        viewBox="0 0 2048 2732"
        x="0"
        y={svgHeight - svgHeight * 0.45}
        height={svgHeight * 0.5}
        className="iceberg"
      />
      {wavePaths}
    </svg>
  );
}

function generateWavePaths(
  waveValues: WaveFunctionValues,
  coordinates: { xMin: number; xMax: number; yMin: number; yMax: number },
  coordinateMapping: {
    toSvgX: (num: number) => number;
    toSvgY: (num: number) => number;
  }
): JSX.Element[] {
  const { xMin, xMax, yMin, yMax } = coordinates;
  const { toSvgX, toSvgY } = coordinateMapping;

  // convert the actual wave function values to be in the svg coordinate basis
  const waveFunctionValuesSvg = {} as WaveFunctionValues;

  for (const entry of ObjectTyped.entries(waveValues)) {
    const [key, value] = entry;

    if (key !== "xs") {
      waveFunctionValuesSvg[key] = value.map((val) => toSvgY(-val));
    } else {
      waveFunctionValuesSvg[key] = value.map((val) => toSvgX(val));
    }
  }

  // generate the svg paths
  const xsSvg = waveFunctionValuesSvg.xs;

  const waveFunctionPaths = [] as JSX.Element[];

  for (const entry of ObjectTyped.entries(waveFunctionValuesSvg)) {
    const [key, value] = entry;

    let wavePath = "";
    let waveFill = `M ${toSvgX(xMin)} ${toSvgY(yMax)}`;

    if (key !== "xs") {
      for (let i = 0; i < value.length; i++) {
        const x = xsSvg[i];
        const y = value[i];

        if (i === 0) {
          // move the cursor to the starting point
          wavePath += `M ${x} ${y}`;
        } else {
          wavePath += `L ${x} ${y}`;
        }

        waveFill += `L ${x} ${y}`;
      }
    }

    waveFill += `L ${toSvgX(xMax)} ${toSvgY(yMax)} Z`;

    const wavePathRender = (
      <path
        d={wavePath}
        key={`${key}-path`}
        className={key}
        fill="none"
        strokeWidth={0.5}
        color={wavePathColors[key]}
        opacity={waveOpacity}
      ></path>
    );

    const waveFillRender = (
      <path
        d={waveFill}
        className={key}
        key={`${key}-fill`}
        fill={wavePathColors[key]}
        stroke="none"
        opacity={waveOpacity}
      ></path>
    );

    waveFunctionPaths.push(
      <>
        {wavePathRender} {waveFillRender}
      </>
    );
  }

  return waveFunctionPaths;
}

function svgCssAnimation(xTranslate: number) {
  let svgCss = "";

  const genKeyframeAnimation = (id: string, index: number) => {
    const keyframeCSs =
      index % 2 === 0
        ? `
          @keyframes ${id} {
              0% {
                  transform: translate(${-3 * xTranslate}%);
              }
              100% {
                  transform: translate(${-xTranslate}%);
              }
          }\n
          `
        : `
          @keyframes ${id} {
              0% {
                  transform: translate(${-xTranslate}%);
              }
              100% {
                  transform: translate(${-4 * xTranslate}%);
              }
          }\n
          `;

    return keyframeCSs;
  };

  const genAnimation = (id: string) => {
    return `
      .${id} {
          animation: ${id} 3s cubic-bezier(0.445, 0.05, 0.55, 0.95) 0s infinite;
          animation-direction: alternate;
      }\n
      `;
  };

  for (let i = 0; i < waveFunctionTypes.length; i++) {
    const waveFunction = waveFunctionTypes[i];

    svgCss += genKeyframeAnimation(waveFunction, i);
    svgCss += genAnimation(waveFunction);
  }

  svgCss += genIcebergCss(xTranslate);

  return svgCss;
}

function genIcebergCss(xTranslate: number) {
  let icebergCss = "";

  const icebergAnimation = `
      @keyframes iceberg {
          0% {
              transform: translateX(${
                1.5 * xTranslate
              }%) skew(-1deg) rotate(2deg);
          }
          100% {
              transform: translateX(${
                -1.5 * xTranslate
              }%) skew(1deg) rotate(-2deg);
          }
      }\n
      `;

  const icebergStyles = `
      .iceberg > * {
          animation: iceberg 3s cubic-bezier(0.445, 0.05, 0.55, 0.95) 0s infinite;
          animation-direction: alternate;
      }\n
      `;

  icebergCss += icebergAnimation;
  icebergCss += icebergStyles;

  return icebergCss;
}
