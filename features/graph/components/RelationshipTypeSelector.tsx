'use client'

import { RelationshipTypeSelectorProps } from '../types/graph'

export function RelationshipTypeSelector({
  pendingConnection,
  onSelect,
  onClose,
}: RelationshipTypeSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <div className="mb-2 text-sm font-medium">Select relationship type</div>

        <div className="flex flex-col gap-2">
          {pendingConnection.options.map((rel) => (
            <button
              key={rel}
              className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
              onClick={() => {
                onSelect(rel)
              }}
            >
              {rel}
            </button>
          ))}
        </div>

        <button
          className="mt-3 text-xs text-gray-500 hover:underline"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
