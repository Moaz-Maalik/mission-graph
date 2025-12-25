'use client'

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import ReactFlow, { Background, Controls, Edge, Node } from 'reactflow'
import GraphNode from './GraphNode'
import { GraphData } from '../types/graph'

import { RelationshipTypeSelector } from './RelationshipTypeSelector'
import { useGraphInteractions } from '../hooks/useGraphInteractions'

const nodeTypes = {
  default: GraphNode,
}

export function GraphView({ graph }: { graph: GraphData }) {
  const componentTypes = useQuery(api.queries.getComponentTypes.default)
  const typeMap = new Map(componentTypes?.map((t) => [t.typeId, t]))
  const {
    onDragOver,
    onDrop,
    onNodeDragStop,
    onConnect,
    onNodesDelete,
    onEdgesDelete,
    pendingConnection,
    onRelationshipSelect,
    closeRelationshipSelector,
  } = useGraphInteractions(graph, typeMap)

  const nodes: Node[] = graph.components.map((c) => {
    const type = typeMap.get(c.typeId)
    const isEditable = type?.capabilities.includes('editable')

    return {
      id: c._id,
      position: c.position,
      data: {
        label: c.label,
        value: c.computedState?.value ?? c.data?.value ?? null,
        typeId: c.typeId,
        componentId: c._id,
        draggable: !isEditable,
        selectable: true,

        subflows: type?.subflows,
        capabilities: type?.capabilities ?? [],
        isComputed: type?.ui?.isComputed ?? false,
      },
      style: type?.ui?.isComputed ? { border: '2px dotted purple' } : undefined,
    }
  })

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
      fill: '#374151', // gray-700
    },
  }))

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
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background gap={16} size={1} />
        <Controls />
      </ReactFlow>
      {/* TODO: Use a proper modal for this (maybe use a component lib for this) */}
      {pendingConnection && (
        <RelationshipTypeSelector
          pendingConnection={pendingConnection}
          onClose={closeRelationshipSelector}
          onSelect={onRelationshipSelect}
        />
      )}
    </div>
  )
}
