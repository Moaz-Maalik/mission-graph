'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { useCallback, useState } from 'react'
import {
  NodeDragHandler,
  OnConnect,
  useReactFlow,
  OnNodesDelete,
  OnEdgesDelete,
} from 'reactflow'
import { GraphData } from '../types/graph'
import { Doc } from '@/convex/_generated/dataModel'

export type ComponentTypeData = Doc<'componentTypes'>

export function useGraphInteractions(
  graph: GraphData,
  typeMap: Map<string, ComponentTypeData>,
) {
  const reactFlow = useReactFlow()
  const [pendingConnection, setPendingConnection] = useState<{
    source: string
    target: string
    options: string[]
  } | null>(null)

  const createComponent = useMutation(api.mutations.createComponent.default)
  const updatePosition = useMutation(
    api.mutations.updateComponentPosition.default,
  )
  const createRelationship = useMutation(
    api.mutations.createRelationship.default,
  )
  const deleteComponent = useMutation(api.mutations.deleteComponent.default)
  const deleteRelationship = useMutation(
    api.mutations.deleteRelationship.default,
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault()

      const raw = event.dataTransfer.getData('application/reactflow')
      if (!raw) return

      const { typeId } = JSON.parse(raw)

      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      await createComponent({
        label: typeId,
        typeId,
        position,
      })
    },
    [reactFlow, createComponent],
  )

  const onNodeDragStop: NodeDragHandler = (_event, node) => {
    updatePosition({
      componentId: node.id as Id<'components'>,
      position: node.position,
    })
  }

  const onConnect: OnConnect = (connection) => {
    if (!connection.source || !connection.target) return

    const sourceNode = graph.components.find((c) => c._id === connection.source)
    const targetNode = graph.components.find((c) => c._id === connection.target)

    if (!sourceNode || !targetNode) return

    const sourceType = typeMap.get(sourceNode.typeId)
    const targetType = typeMap.get(targetNode.typeId)

    if (!sourceType || !targetType) return

    const validRelations = sourceType.allowedOutgoing.filter((rel) =>
      targetType.allowedIncoming.includes(rel),
    )

    if (validRelations.length === 0) {
      alert('These components cannot be connected')
      return
    }

    if (validRelations.length === 1) {
      createRelationship({
        fromComponentId: sourceNode._id,
        toComponentId: targetNode._id,
        type: validRelations[0],
      })
      return
    }

    setPendingConnection({
      source: sourceNode._id,
      target: targetNode._id,
      options: validRelations,
    })
  }

  const onNodesDelete: OnNodesDelete = async (nodes) => {
    for (const node of nodes) {
      await deleteComponent({ componentId: node.id as Id<'components'> })
    }
  }

  const onEdgesDelete: OnEdgesDelete = async (edges) => {
    for (const edge of edges) {
      await deleteRelationship({
        relationshipId: edge.id as Id<'relationships'>,
      })
    }
  }

  const onRelationshipSelect = (type: string) => {
    if (pendingConnection) {
      createRelationship({
        fromComponentId: pendingConnection.source as Id<'components'>,
        toComponentId: pendingConnection.target as Id<'components'>,
        type,
      })
      setPendingConnection(null)
    }
  }

  const closeRelationshipSelector = () => {
    setPendingConnection(null)
  }

  return {
    onDragOver,
    onDrop,
    onNodeDragStop,
    onConnect,
    onNodesDelete,
    onEdgesDelete,
    pendingConnection,
    onRelationshipSelect,
    closeRelationshipSelector,
  }
}
