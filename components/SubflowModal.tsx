import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { SubflowGraphResult } from '@/types/subflow'

type Props = {
  title: string
  result: SubflowGraphResult
  onClose: () => void
}

export function SubflowModal({ title, result, onClose }: Props) {
  const nodes: Node[] = result.nodes.map((n, index) => ({
    id: n.id,
    data: { label: n.label },
    position: {
      x: 100 + index * 200,
      y: 200,
    },
  }))

  const edges: Edge[] = result.edges.map((e) => ({
    id: `${e.from}-${e.to}-${e.type}`,
    source: e.from,
    target: e.to,
    label: e.type,
  }))

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40">
      <div className="flex h-[80vh] w-[80vw] flex-col rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <div className="font-medium">{title}</div>
          <button onMouseDown={onClose}>✕</button>
        </div>

        <div className="flex-1">
          <ReactFlowProvider>
            <ReactFlow nodes={nodes} edges={edges} fitView>
              <Background />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  )
}
