import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";

import { DnDProvider } from "./drag-drop-provider";

import { WorkflowBuilderProvider } from "@/providers/flow-provider";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <DnDProvider>
        <ReactFlowProvider>
          <WorkflowBuilderProvider>{children}</WorkflowBuilderProvider>
        </ReactFlowProvider>
      </DnDProvider>
    </HeroUIProvider>
  );
}
