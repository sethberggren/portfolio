import { createStateManagement, ReducerFunctions } from "../state/stateManagment";

type CarouselState = {
    indexInView: number;
    ids: string[];
    numOfPanels: number;
    hasNavDots: boolean;
    hasArrows: boolean;
    displaySize: {width: number; height: number};
    viewport: {width: number; height: number};
    viewportScrollAmount: number;
    scrollTiming: number;
}

const carouselInitialState : CarouselState = {
    indexInView: 0,
    ids: [] as string[],
    numOfPanels: 0,
    hasNavDots: false,
    hasArrows: false,
    displaySize: {width: 0, height: 0},
    viewport: {width: window.innerWidth, height: window.innerHeight},
    viewportScrollAmount: 0,
    scrollTiming: 500
}

type CarouselActions = {
    type: "shiftRight",
    payload: null
} | {
    type: "shiftLeft",
    payload: null
} | {
    type: "setNumOfPanels",
    payload: number
} | {
    type: "setHasNavDots",
    payload: boolean
} | {
    type: "setHasArrows",
    payload: boolean
} | {
    type: "setDisplaySize",
    payload: {width: number, height: number}
} | {
    type: "setViewport",
    payload: {width: number, height: number}
} | {
    type: "setViewportScrollAmount",
    payload: number
} | {
    type: "setIndexInView",
    payload: number
} | {
    type: "setScrollTiming",
    payload: number
} | {
    type: "addId",
    payload: {id: string, index: number}
}

const carouselReducerFunctions : ReducerFunctions<CarouselState, CarouselActions> = {
    shiftRight: (state: CarouselState, {payload}: {payload: null}) => {

        const {indexInView, numOfPanels} = state;

        if (indexInView >= 0) {

            if (indexInView === numOfPanels - 1) {
                return {...state, indexInView: 0}
            }

            return {...state, indexInView: indexInView + 1}
        } else {
            return {...state}
        }
    },
    shiftLeft: (state: CarouselState, {payload}: {payload: null}) => {
        const {indexInView, numOfPanels} = state;

        if (indexInView <= numOfPanels - 1) {

            if (indexInView === 0) {
                return {...state, indexInView: numOfPanels - 1}
            }

            return {...state, indexInView: indexInView - 1}
        } else {
            return {...state}
        }
    }, 
    setNumOfPanels: (state: CarouselState, {payload}: {payload: number}) => {
        return {...state, numOfPanels: payload}
    }, 
    setHasNavDots: (state: CarouselState, {payload}: {payload: boolean}) => {
        return {...state, hasNavDots: payload}
    },
    setDisplaySize: (state: CarouselState, { payload }: { payload: { height: number; width: number } }) => {
        return {...state, displaySize: {...payload}}
    },
    setViewport: (state: CarouselState, {payload}: {payload: {height: number; width: number}}) => {
        return {...state, viewport: {...payload}}
    },
    setViewportScrollAmount: (state: CarouselState, {payload}: {payload: number}) => {
        return {...state, viewportScrollAmount: payload}
    },
    setHasArrows: (state: CarouselState, {payload}: {payload: boolean}) => {
        return {...state, hasArrows: payload}
    },
    setIndexInView: (state: CarouselState, {payload}: {payload: number}) => {
        return {...state, indexInView: payload}
    },
    setScrollTiming: (state: CarouselState, {payload}: {payload: number}) => {
        return {...state, scrollTiming: payload}
    }, 
    addId: (
        state: CarouselState,
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
}

const [returnCarouselContext, returnCarouselDispatch, providerProps] = createStateManagement({state: carouselInitialState, reducerFunctions: carouselReducerFunctions});

function useCarouselContext() {
    return checkContext(returnCarouselContext());
};

function useCarouselDispatch() {
    return checkDispatch(returnCarouselDispatch());
}

export {useCarouselContext, useCarouselDispatch, providerProps};

const missingContextError =
  "This component must be used inside of the Carousel component.";

function checkContext(
    context: CarouselState | undefined
  ): CarouselState {
    if (!context) {
      throw new Error(missingContextError);
    }
  
    return context;
  }
function checkDispatch(
    dispatch: React.Dispatch<CarouselActions> | undefined
  ): React.Dispatch<CarouselActions> {
    if (!dispatch) {
      throw new Error(missingContextError);
    }
  
    return dispatch;
  }
  