"use client";

import { useGraphSubflowContext } from "@/context/GraphSubflowContext";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";

export default function GraphNode({ data }: NodeProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<number | "">(data.value ?? "");
  const { openSubflowMenu } = useGraphSubflowContext();

  const updateValue = useMutation(api.mutations.updateInputValue.default);

  const isEditable = data.capabilities?.includes("editable");

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        openSubflowMenu({
          componentId: data.componentId,
          subflows: data.subflows,
        });
      }}
      onDoubleClick={() => {
        if (isEditable) setEditing(true);
      }}
    >
      <div className="text-xs text-gray-500">{data.label}</div>

      {editing ? (
        <input
          autoFocus
          type="number"
          className="mt-1 w-full rounded border px-1 text-sm"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          onBlur={async () => {
            await updateValue({
              componentId: data.componentId,
              value: Number(value),
            });
            setEditing(false);
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await updateValue({
                componentId: data.componentId,
                value: Number(value),
              });
              setEditing(false);
            }
          }}
        />
      ) : (
        <div className="text-sm font-medium">{data.value ?? "—"}</div>
      )}

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
