import { useEffect, useRef, useState } from "react";
import styles from "./waves.module.scss";
import axios from "axios";
import backendUrl from "../backendUrl";
import WaveSvg from "./WaveSvg";
import { useGlobalContext } from "../state/globalContext";

export const waveFunctionTypes = ["xs", "sin", "cos"] as const;
export type WaveFunctions = typeof waveFunctionTypes[number];
type WaveFunctionValues = { [key in WaveFunctions]: number[] };

export type SampleFunctionParams = {samples: number; xMin: number, xMax: number};

export type WaveFunctionValueResponse = {
  functionValues: WaveFunctionValues,
  params: SampleFunctionParams
}

export function Waves() {
  const [waveValues, setWaveValues] = useState<WaveFunctionValueResponse>(
    {} as WaveFunctionValueResponse
  );

  const { viewport } = useGlobalContext();

  const partialViewport = {
    height: viewport.height * 0.9,
    width: viewport.width,
  };

  useEffect(() => {
    const getWaveVals = async () => {
      const response = await axios.get(backendUrl("waves"));

      setWaveValues(response.data as WaveFunctionValueResponse);
    };

    getWaveVals();
  }, []);

  return (
    <div className={styles.ocean}>
      <h1 className={styles.welcome}>
        Hi, I'm Seth Berggren, a full-stack web developer. Welcome to my
        website!{" "}
      </h1>
      {Object.keys(waveValues).length === 0 ? (
        <></>
      ) : (
        <WaveSvg waveValues={waveValues} viewport={partialViewport} />
      )}
    </div>
  );
}
