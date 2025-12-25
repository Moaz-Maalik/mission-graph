import { Id } from '@/convex/_generated/dataModel'

export type GraphData = {
  components: {
    _id: Id<'components'>
    _creationTime: number
    // TODO: type the graph data properly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    computedState?: any
    position: {
      x: number
      y: number
    }
    label: string
    typeId: string
    // TODO: type the graph data properly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
    createdAt: number
    updatedAt: number
  }[]
  relationships: {
    _id: Id<'relationships'>
    _creationTime: number
    fromComponentId: Id<'components'>
    toComponentId: Id<'components'>
    type: string
    createdAt: number
  }[]
}

export type GraphNodeData = {
  label: string
  value?: number | null
  typeId: string
  componentId: string
  subflows?: string[]
  capabilities?: string[]
}

export type SubflowMenuState = {
  componentId: string
  subflows: string[]
}

export type MenuProps = {
  menu: SubflowMenuState
  openSubflow: (componentId: string, subflow: string) => void
  closeMenu: () => void
}

type PendingConnection = {
  source: string
  target: string
  options: string[]
}

export type RelationshipTypeSelectorProps = {
  pendingConnection: PendingConnection
  onSelect: (type: string) => void
  onClose: () => void
}
