"use client";

import { createContext, useContext } from "react";
import { useGraphSubflow } from "@/hooks/useGraphSubflow";

const GraphSubflowContext = createContext<ReturnType<
  typeof useGraphSubflow
> | null>(null);

export function GraphSubflowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useGraphSubflow();
  return (
    <GraphSubflowContext.Provider value={value}>
      {children}
    </GraphSubflowContext.Provider>
  );
}

export function useGraphSubflowContext() {
  const ctx = useContext(GraphSubflowContext);
  if (!ctx) {
    throw new Error(
      "useGraphSubflowContext must be used within GraphSubflowProvider"
    );
  }
  return ctx;
}
