"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactFlowProvider } from "reactflow";
import { GraphSubflowProvider } from "@/context/GraphSubflowContext";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <GraphSubflowProvider>
        <ReactFlowProvider>{children}</ReactFlowProvider>
      </GraphSubflowProvider>
    </ConvexProvider>
  );
}
