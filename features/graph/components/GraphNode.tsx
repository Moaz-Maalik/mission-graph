'use client'

import { memo, useState } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { Info, Pencil } from 'lucide-react'
import { useGraphSubflowContext } from '@/context/GraphSubflowContext'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { Id } from '@/convex/_generated/dataModel'
import { GraphNodeData } from '../types/graph'

function GraphNode({ data }: NodeProps<GraphNodeData>) {
  const [hovered, setHovered] = useState(false)
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState<number | ''>(data.value ?? '')

  const { openSubflowMenu } = useGraphSubflowContext()
  const updateValue = useMutation(api.mutations.updateInputValue.default)

  const isEditable = data.capabilities?.includes('editable')

  // Helper to prevent React Flow's drag/selection logic from firing on buttons/inputs
  const preventNodeInteraction = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className={`relative rounded-lg bg-white px-4 py-3  ${
        editing ? 'nodrag' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div
          className="absolute -top-3 right-1 flex gap-1 rounded bg-white p-1 shadow"
          onMouseDown={preventNodeInteraction}
        >
          {data.subflows?.length ? (
            <button
              type="button"
              className="rounded p-1 hover:bg-gray-100"
              onMouseDown={preventNodeInteraction}
              onClick={(e) => {
                e.stopPropagation()
                openSubflowMenu({
                  componentId: data.componentId,
                  subflows: data.subflows!,
                })
              }}
            >
              <Info size={14} />
            </button>
          ) : null}

          {isEditable && (
            <button
              type="button"
              className="rounded p-1 hover:bg-gray-100"
              onMouseDown={preventNodeInteraction}
              onClick={(e) => {
                e.stopPropagation()
                setEditing(true)
              }}
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
      )}

      <div className="text-center">
        <div className="text-xs text-gray-500">{data.label}</div>

        {editing ? (
          <input
            autoFocus
            type="number"
            className="mt-1 w-full rounded border px-1 text-sm"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            onMouseDown={preventNodeInteraction}
            onBlur={async () => {
              await updateValue({
                componentId: data.componentId as Id<'components'>,
                value: Number(value),
              })
              setEditing(false)
            }}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                await updateValue({
                  componentId: data.componentId as Id<'components'>,
                  value: Number(value),
                })
                setEditing(false)
              }
              if (e.key === 'Escape') {
                setEditing(false)
                setValue(data.value ?? '')
              }
            }}
          />
        ) : (
          <div className="mt-1 text-sm font-medium">{data.value ?? ''}</div>
        )}
      </div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default memo(GraphNode)
