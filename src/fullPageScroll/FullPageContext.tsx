import {
  createStateManagement,
  DispatchAction,
  ReducerFunctions,
} from "../state/stateManagment";

type FullPageSharedState = {
  indexInView: number;
  ids: string[];
  numOfPanels: number;
  hasNavBar: boolean;
  navBarHeight: number;
  hasNavDots: boolean;
  viewport: { width: number; height: number };
};

const fullPageInitialState: FullPageSharedState = {
  indexInView: 0,
  ids: [] as string[],
  numOfPanels: 0,
  hasNavBar: false,
  navBarHeight: 0,
  hasNavDots: false,
  viewport: { width: window.innerWidth, height: window.innerHeight },
};

type FullPageActions =
  | {
      type: "scrollUp";
      payload: null;
    }
  | { type: "scrollDown"; payload: null }
  | { type: "addId"; payload: string }
  | {
      type: "setNumOfPanels";
      payload: number;
    }
  | {
      type: "setHasNavBar";
      payload: boolean;
    }
  | {
      type: "setNavBarHeight";
      payload: number;
    }
  | {
      type: "setHasNavDots";
      payload: boolean;
    }
  | {
      type: "setViewport";
      payload: { height: number; width: number };
    };

const fullPageReducerFunctions: ReducerFunctions<
  FullPageSharedState,
  FullPageActions
> = {
  scrollUp: (state: FullPageSharedState, { payload }: { payload: null }) => {
    const { numOfPanels, indexInView } = state;

    if (indexInView > 0) {
      return { ...state, indexInView: indexInView - 1 };
    } else {
      return { ...state };
    }
  },

  scrollDown: (state: FullPageSharedState, { payload }: { payload: null }) => {
    const { numOfPanels, indexInView } = state;

    if (indexInView < numOfPanels - 1) {
      return { ...state, indexInView: indexInView + 1 };
    } else {
      return { ...state };
    }
  },

  addId: (state: FullPageSharedState, { payload }: { payload: string }) => {
    const newIds = [...state.ids];
    newIds.push(payload);

    return { ...state, ids: newIds };
  },

  setNumOfPanels: (
    state: FullPageSharedState,
    { payload }: { payload: number }
  ) => {
    return { ...state, numOfPanels: payload };
  },

  setHasNavBar: (
    state: FullPageSharedState,
    { payload }: { payload: boolean }
  ) => {
    return { ...state, hasNavBar: payload };
  },

  setNavBarHeight: (
    state: FullPageSharedState,
    { payload }: { payload: number }
  ) => {
    return { ...state, navBarHeight: payload };
  },

  setHasNavDots: (
    state: FullPageSharedState,
    { payload }: { payload: boolean }
  ) => {
    return { ...state, hasNavDots: payload };
  },
  setViewport: (
    state: FullPageSharedState,
    { payload }: { payload: { height: number; width: number } }
  ) => {
    return { ...state, viewport: { ...payload } };
  },
};

const [useFullPageContext, useFullPageDispatch, providerProps] = createStateManagement<
  FullPageSharedState,
  FullPageActions
>({ state: fullPageInitialState, reducerFunctions: fullPageReducerFunctions });

export {useFullPageContext, useFullPageDispatch, providerProps};
