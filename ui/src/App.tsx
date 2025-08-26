import { Route, Routes } from "react-router-dom";

import WorkflowBuilderPage from "@/pages/workflow-builder";

function App() {
  return (
    <Routes>
      <Route element={<WorkflowBuilderPage />} path="/" />
    </Routes>
  );
}

export default App;
