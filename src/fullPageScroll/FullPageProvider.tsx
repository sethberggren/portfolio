import React from "react";
import { StateManagementProvider } from "../state/stateManagment";
import { providerProps } from "./FullPageContext";

export default function FullPageProvider(props: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const { children } = props;

  return (
    <StateManagementProvider providerProps={providerProps}>
      {children}
    </StateManagementProvider>
  );
}
