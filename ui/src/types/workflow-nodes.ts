import { Node } from "@xyflow/react";

// Base workflow node interface that extends ReactFlow's Node
export interface BaseWorkflowNode extends Node {
  data: {
    label: string;
    nodeType: "start" | "step" | "decision" | "end";
    config?: Record<string, any>;
  };
}

// Start Node - pastel green, single bottom output handle
export interface StartNode extends BaseWorkflowNode {
  type: "start";
  data: {
    label: string;
    nodeType: "start";
  };
}

// Step Node - pastel orange, top input + bottom output handles
export interface StepNode extends BaseWorkflowNode {
  type: "step";
  data: {
    label: string;
    nodeType: "step";
    config: Record<string, string>; // key-value pairs for configuration
  };
}

// Decision condition interface for Decision nodes
export interface DecisionCondition {
  leftOperand: string;
  operator:
    | "=="
    | "!="
    | ">"
    | "<"
    | ">="
    | "<="
    | "contains"
    | "startsWith"
    | "endsWith";
  rightOperand: string;
}

// Decision Node - pastel blue, diamond shape, top input + two bottom outputs
export interface DecisionNode extends BaseWorkflowNode {
  type: "decision";
  data: {
    label: string;
    nodeType: "decision";
    condition: DecisionCondition;
  };
}

// End Node - pastel red, single top input handle
export interface EndNode extends BaseWorkflowNode {
  type: "end";
  data: {
    label: string;
    nodeType: "end";
  };
}

// Union type for all custom workflow nodes
export type CustomWorkflowNode = StartNode | StepNode | DecisionNode | EndNode;

// Validation error types
export interface ValidationError {
  type:
    | "missing-start"
    | "multiple-start"
    | "unlabeled-decision-edges"
    | "invalid-connection";
  message: string;
  nodeId?: string;
  edgeId?: string;
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Node configuration schema for different node types
export interface NodeConfig {
  // Step node configuration
  stepConfig?: {
    [key: string]: string;
  };

  // Decision node configuration
  decisionCondition?: DecisionCondition;
}

// Type guards for node type checking
export const isStartNode = (node: CustomWorkflowNode): node is StartNode => {
  return node.type === "start";
};

export const isStepNode = (node: CustomWorkflowNode): node is StepNode => {
  return node.type === "step";
};

export const isDecisionNode = (
  node: CustomWorkflowNode,
): node is DecisionNode => {
  return node.type === "decision";
};

export const isEndNode = (node: CustomWorkflowNode): node is EndNode => {
  return node.type === "end";
};

// Helper function to create default nodes
export const createDefaultStartNode = (
  id: string,
  position: { x: number; y: number },
): StartNode => ({
  id,
  type: "start",
  position,
  data: {
    label: "Start",
    nodeType: "start",
  },
});

export const createDefaultStepNode = (
  id: string,
  position: { x: number; y: number },
): StepNode => ({
  id,
  type: "step",
  position,
  data: {
    label: "Step",
    nodeType: "step",
    config: {},
  },
});

export const createDefaultDecisionNode = (
  id: string,
  position: { x: number; y: number },
): DecisionNode => ({
  id,
  type: "decision",
  position,
  data: {
    label: "Decision",
    nodeType: "decision",
    condition: {
      leftOperand: "",
      operator: "==",
      rightOperand: "",
    },
  },
});

export const createDefaultEndNode = (
  id: string,
  position: { x: number; y: number },
): EndNode => ({
  id,
  type: "end",
  position,
  data: {
    label: "End",
    nodeType: "end",
  },
});
