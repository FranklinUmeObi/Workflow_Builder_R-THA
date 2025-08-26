import React from "react";
import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";

import { useWorkflowBuilder } from "../../providers/flow-provider";

// Success icon (checkmark)
const CheckIcon = ({ size = 16, className = "" }) => (
  <svg
    className={className}
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size}
  >
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

// Error icon (exclamation mark)
const AlertIcon = ({ size = 16, className = "" }) => (
  <svg
    className={className}
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

interface ValidationBadgeProps {
  className?: string;
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({
  className = "",
}) => {
  const { validationResult } = useWorkflowBuilder();

  if (validationResult.isValid) {
    return (
      <Button
        aria-label="Workflow validation passed"
        className={`pointer-events-none ${className}`}
        color="success"
        size="sm"
        startContent={<CheckIcon size={14} />}
        variant="flat"
      >
        Valid Workflow
      </Button>
    );
  }

  const errorCount = validationResult.errors.length;

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button
          aria-label={`Workflow has ${errorCount} validation error${errorCount > 1 ? "s" : ""}`}
          className={className}
          color="danger"
          size="sm"
          startContent={<AlertIcon size={14} />}
          variant="flat"
        >
          {errorCount} Error{errorCount > 1 ? "s" : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-3 py-2 max-w-sm">
          <div className="text-small font-bold text-danger mb-2">
            Validation Errors
          </div>
          <div className="space-y-1">
            {validationResult.errors.map((error, index) => (
              <div key={index} className="text-tiny text-default-600">
                • {error.message}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ValidationBadge;
