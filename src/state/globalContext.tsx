
import React, { createContext, useContext, useReducer } from "react";
import { createStateManagement, ReducerFunctions } from "./stateManagment";

export type GlobalState = {
  viewport: { width: number; height: number };
};

const initialGlobalContext = {
  viewport: { width: window.innerWidth, height: window.innerHeight },
};

export type Action = {
  type: "setViewport";
  payload: {height: number, width: number};
};

const globalReducerFunctions : ReducerFunctions<GlobalState, Action> = {
  "setViewport": (
      state: GlobalState, 
      {payload}: {payload: {height: number, width: number}}
  ) => {

      return {...state, viewport: {...payload}}
  }
}

const [useGlobalContext, useGlobalDispatch, providerProps] = createStateManagement<GlobalState, Action>({
  state: initialGlobalContext,
  reducerFunctions: globalReducerFunctions
});

export {useGlobalContext, useGlobalDispatch, providerProps};