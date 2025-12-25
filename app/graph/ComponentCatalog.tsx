"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ComponentCatalog() {
  const types = useQuery(api.queries.getComponentTypes.default);

  if (!types) return null;

  return (
    <div className="w-64 border-r bg-white p-3 space-y-2">
      <div className="text-xs font-semibold text-gray-500 uppercase">
        Components
      </div>

      {types.map((type) => (
        <div
          key={type.typeId}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData(
              "application/reactflow",
              JSON.stringify({ typeId: type.typeId })
            );
            e.dataTransfer.effectAllowed = "move";
          }}
          className="
            cursor-grab rounded-md border
            px-3 py-2 text-sm
            bg-gray-50 hover:bg-gray-100
          "
        >
          {type.label}
        </div>
      ))}
    </div>
  );
}
