import React, { createContext, useContext, useReducer } from "react";

export type DispatchAction = {
  type: string;
  payload: unknown;
};

type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = Extract<
  T,
  Record<K, V>
>;

export type ReducerFunctions<
  State extends object,
  Action extends DispatchAction
> = {
  [key in Action["type"]]: (
    state: State,
    { payload }: { payload: DiscriminateUnion<Action, "type", key>["payload"] }
  ) => State;
};

export type StateManagementParams<
  State extends Object,
  Actions extends DispatchAction,
> = {
  state: State;
  reducerFunctions: ReducerFunctions<State, Actions>
};

export function createStateManagement<
  State extends Object,
  Actions extends DispatchAction,
>(params: StateManagementParams<State, Actions>) {
  const { state, reducerFunctions } = params;

  const stateContext = createContext(state);
  const stateDispatch = createContext({} as React.Dispatch<Actions>);

  const useStateContext = () => useContext(stateContext);
  const useStateDispatch = () => useContext(stateDispatch);

  const reducer = (state: State, action: Actions) => {
    // not sure why this is needing to be cast as below, maybe because of the way that DispatchAction is defined?
    return reducerFunctions[action.type as keyof typeof reducerFunctions](
      state,
      action
    );
  };

  return [
    useStateContext,
    useStateDispatch,
    {
      state: state,
      stateContext: stateContext,
      dispatchContext: stateDispatch,
      reducer: reducer,
    },
  ] as const;
}

type StateManagmentProviderProps<
  State extends Object,
  Actions extends DispatchAction
> = {
  children: React.ReactNode;
  providerProps: {
    state: State;
    stateContext: React.Context<State>;
    dispatchContext: React.Context<React.Dispatch<Actions>>;
    reducer: (state: State, action: Actions) => State;
  };
};

export function StateManagementProvider<
  State extends Object,
  Actions extends DispatchAction
>(props: StateManagmentProviderProps<State, Actions>) {
  const { children, providerProps } = props;

  const { state, stateContext, dispatchContext, reducer } = providerProps;

  const [newState, dispatch] = useReducer(reducer, state);

  return (
    <stateContext.Provider value={newState}>
      <dispatchContext.Provider value={dispatch}>
        {children}
      </dispatchContext.Provider>
    </stateContext.Provider>
  );
}
