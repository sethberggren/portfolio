import React from "react";
import {
  createStateManagement,
  DispatchAction,
  ReducerFunctions,
} from "../state/stateManagment";

type FullPageSharedState = {
  indexInView: number | null;
  ids: string[];
  numOfPanels: number;
  hasNavBar: boolean;
  navBarHeight: number;
  hasNavDots: boolean;
  viewport: { width: number; height: number };
  viewportScrollAmount: number;
  scrollTiming: number;
  canScroll: boolean;
  drawerIsOpen: boolean;
};

const fullPageInitialState: FullPageSharedState = {
  indexInView: null,
  ids: [] as string[],
  numOfPanels: 0,
  hasNavBar: false,
  navBarHeight: 0,
  hasNavDots: false,
  viewport: { width: window.innerWidth, height: window.innerHeight },
  viewportScrollAmount: 0,
  scrollTiming: 500,
  canScroll: true,
  drawerIsOpen: false,
};

type FullPageActions =
  | {
      type: "scrollUp";
      payload: null;
    }
  | { type: "scrollDown"; payload: null }
  | { type: "addId"; payload: { id: string; index: number } }
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
    }
  | {
      type: "setIndexInView";
      payload: number;
    }
  | {
      type: "setViewPortScrollAmount";
      payload: number;
    }
  | {
      type: "setIndexFromId";
      payload: string;
    }
  | { type: "setScrollTiming"; payload: number }
  | { type: "setCanScroll"; payload: boolean }
  | {
      type: "setDrawerIsOpen";
      payload: boolean;
    };

const fullPageReducerFunctions: ReducerFunctions<
  FullPageSharedState,
  FullPageActions
> = {
  scrollUp: (state: FullPageSharedState, { payload }: { payload: null }) => {
    const { numOfPanels, indexInView, canScroll } = state;

    if (indexInView !== null && indexInView > 0 && canScroll) {
      return { ...state, indexInView: indexInView - 1 };
    } else {
      return { ...state };
    }
  },

  scrollDown: (state: FullPageSharedState, { payload }: { payload: null }) => {
    const { numOfPanels, indexInView, canScroll } = state;

    if (indexInView !== null && indexInView < numOfPanels - 1 && canScroll) {
      return { ...state, indexInView: indexInView + 1 };
    } else {
      return { ...state };
    }
  },

  addId: (
    state: FullPageSharedState,
    { payload }: { payload: { index: number; id: string } }
  ) => {
    const { index, id } = payload;

    const newIds = [...state.ids];

    if (!newIds.includes(id)) {
      newIds[index] = id;

      return { ...state, ids: newIds };
    } else {
      return { ...state };
    }
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
  setIndexInView: (
    state: FullPageSharedState,
    { payload }: { payload: number }
  ) => {
    return { ...state, indexInView: payload };
  },
  setViewPortScrollAmount: (
    state: FullPageSharedState,
    { payload }: { payload: number }
  ) => {
    return { ...state, viewportScrollAmount: payload };
  },
  setIndexFromId: (
    state: FullPageSharedState,
    { payload }: { payload: string }
  ) => {
    // this reducer function takes a given ID and sets the index in view from that ID.

    const { ids } = state;

    const idIndex = ids.indexOf(payload);

    if (idIndex === -1) {
      console.warn(
        "Linking ID not found in FullPageContent.  Please ensure all FullPageNavButton 'linkTo' properties match what is in your FullPageContent components."
      );
      return { ...state, indexInView: 0 };
    }

    return { ...state, indexInView: idIndex };
  },

  setScrollTiming: (
    state: FullPageSharedState,
    { payload }: { payload: number }
  ) => {
    return { ...state, scrollTiming: payload };
  },

  setCanScroll: (
    state: FullPageSharedState,
    { payload }: { payload: boolean }
  ) => {
    return { ...state, canScroll: payload };
  },
  setDrawerIsOpen: (
    state: FullPageSharedState,
    { payload }: { payload: boolean }
  ) => {
    return { ...state, drawerIsOpen: payload };
  },
};

const [returnFullPageContext, returnFullPageDispatch, providerProps] =
  createStateManagement<FullPageSharedState, FullPageActions>({
    state: fullPageInitialState,
    reducerFunctions: fullPageReducerFunctions,
  });

export { providerProps };

const missingContextError =
  "This component must be used inside of the FullPageProvider component.";

function checkContext(
  context: FullPageSharedState | undefined
): FullPageSharedState {
  if (!context) {
    throw new Error(missingContextError);
  }

  return context;
}
function checkDispatch(
  dispatch: React.Dispatch<FullPageActions> | undefined
): React.Dispatch<FullPageActions> {
  if (!dispatch) {
    throw new Error(missingContextError);
  }

  return dispatch;
}

export function useFullPageContext() {
  return checkContext(returnFullPageContext());
}

export function useFullPageDispatch() {
  return checkDispatch(returnFullPageDispatch());
}
