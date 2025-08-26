import { BuilderContainer } from "@/components/Builder/workflow-canvas-container";
import DefaultLayout from "@/layouts/default";

export default function WorkflowBuilderPage() {
  return (
    <DefaultLayout>
      <BuilderContainer />
    </DefaultLayout>
  );
}
