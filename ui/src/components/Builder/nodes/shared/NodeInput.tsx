import React from "react";
import { Input } from "@heroui/input";

interface NodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  borderColor: string;
  className?: string;
}

export const NodeInput: React.FC<NodeInputProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  borderColor,
  className = "",
}) => {
  return (
    <Input
      className={`w-full ${className}`}
      classNames={{
        input: "text-center text-sm",
        inputWrapper: `bg-white ${borderColor}`,
      }}
      placeholder={placeholder}
      size="sm"
      value={value}
      variant="bordered"
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
};
