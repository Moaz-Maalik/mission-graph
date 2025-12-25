"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  NodeDragHandler,
  OnConnect,
  useReactFlow,
} from "reactflow";
import GraphNode from "./GraphNode";

const nodeTypes = {
  default: GraphNode,
};

type GraphData = {
  components: {
    _id: Id<"components">;
    _creationTime: number;
    // TODO: type the graph data properly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    computedState?: any;
    position: {
      x: number;
      y: number;
    };
    label: string;
    typeId: string;
    // TODO: type the graph data properly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    createdAt: number;
    updatedAt: number;
  }[];
  relationships: {
    _id: Id<"relationships">;
    _creationTime: number;
    fromComponentId: Id<"components">;
    toComponentId: Id<"components">;
    type: string;
    createdAt: number;
  }[];
};

export function GraphView({ graph }: { graph: GraphData }) {
  const reactFlow = useReactFlow();
  const [pendingConnection, setPendingConnection] = useState<{
    source: string;
    target: string;
    options: string[];
  } | null>(null);

  const componentTypes = useQuery(api.queries.getComponentTypes.default);
  const createComponent = useMutation(api.mutations.createComponent.default);
  const updatePosition = useMutation(
    api.mutations.updateComponentPosition.default
  );
  const createRelationship = useMutation(
    api.mutations.createRelationship.default
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData("application/reactflow");
      if (!raw) return;

      const { typeId } = JSON.parse(raw);

      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      await createComponent({
        label: typeId,
        typeId,
        position,
      });
    },
    [reactFlow, createComponent]
  );

  const onNodeDragStop: NodeDragHandler = (_event, node) => {
    updatePosition({
      componentId: node.id as Id<"components">,
      position: node.position,
    });
  };

  const onConnect: OnConnect = (connection) => {
    if (!connection.source || !connection.target) return;

    const sourceNode = graph.components.find(
      (c) => c._id === connection.source
    );
    const targetNode = graph.components.find(
      (c) => c._id === connection.target
    );

    if (!sourceNode || !targetNode) return;

    const sourceType = typeMap.get(sourceNode.typeId);
    const targetType = typeMap.get(targetNode.typeId);

    if (!sourceType || !targetType) return;

    const validRelations = sourceType.allowedOutgoing.filter((rel) =>
      targetType.allowedIncoming.includes(rel)
    );

    if (validRelations.length === 0) {
      alert("These components cannot be connected");
      return;
    }

    if (validRelations.length === 1) {
      createRelationship({
        fromComponentId: sourceNode._id,
        toComponentId: targetNode._id,
        type: validRelations[0],
      });
      return;
    }

    setPendingConnection({
      source: sourceNode._id,
      target: targetNode._id,
      options: validRelations,
    });
  };

  const typeMap = new Map(componentTypes?.map((t) => [t.typeId, t]));

  const nodes: Node[] = graph.components.map((c) => {
    const type = typeMap.get(c.typeId);
    const isEditable = type?.capabilities.includes("editable");

    return {
      id: c._id,
      position: c.position,
      data: {
        label: c.label,
        value: c.computedState?.value ?? c.data?.value ?? null,
        typeId: c.typeId,
        componentId: c._id,
        draggable: !isEditable,

        subflows: type?.subflows,
        capabilities: type?.capabilities ?? [],
        isComputed: type?.ui?.isComputed ?? false,
      },
      style: type?.ui?.isComputed ? { border: "2px dotted purple" } : undefined,
    };
  });

  const edges: Edge[] = graph.relationships.map((r) => ({
    id: r._id,
    source: r.fromComponentId,
    target: r.toComponentId,
    label: r.type,
    animated: true,
    style: {
      strokeWidth: 2,
    },
    labelStyle: {
      fontSize: 12,
      fill: "#374151", // gray-700
    },
  }));

  return (
    <div className="h-screen w-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
      >
        <Background gap={16} size={1} />
        <Controls />
      </ReactFlow>
      {/* TODO: Use a proper modal for this (maybe use a component lib for this) */}
      {pendingConnection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-2 text-sm font-medium">
              Select relationship type
            </div>

            <div className="flex flex-col gap-2">
              {pendingConnection.options.map((rel) => (
                <button
                  key={rel}
                  className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
                  onClick={() => {
                    createRelationship({
                      fromComponentId:
                        pendingConnection.source as Id<"components">,
                      toComponentId:
                        pendingConnection.target as Id<"components">,
                      type: rel,
                    });
                    setPendingConnection(null);
                  }}
                >
                  {rel}
                </button>
              ))}
            </div>

            <button
              className="mt-3 text-xs text-gray-500 hover:underline"
              onClick={() => setPendingConnection(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
