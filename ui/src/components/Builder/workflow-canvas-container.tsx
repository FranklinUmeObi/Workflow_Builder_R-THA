import "@xyflow/react/dist/style.css";

import { Palette } from "../SideBar/pallette";

import { WorkflowCanvas } from "./workflow-canvas";

export const BuilderContainer = () => {
  return (
    <div className="dndflow">
      <Palette />
      <WorkflowCanvas />
    </div>
  );
};
