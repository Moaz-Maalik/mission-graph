import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { SubflowGraphResult } from '../types/subflow'
import { Id } from '@/convex/_generated/dataModel'

type SubflowMenuState = {
  componentId: string
  subflows: string[]
}

type SubflowModalState = {
  title: string
  result: SubflowGraphResult
}

export function useGraphSubflow() {
  const [menu, setMenu] = useState<SubflowMenuState | null>(null)
  const [modal, setModal] = useState<SubflowModalState | null>(null)
  const runSubflow = useMutation(api.mutations.runSubflow.default)

  async function openSubflow(componentId: string, subflow: string) {
    const result = await runSubflow({
      componentId: componentId as Id<'components'>,
      subflow,
    })

    setModal({
      title: subflow,
      result,
    })
    setMenu(null)
  }

  return {
    menu,
    modal,
    openSubflowMenu: setMenu,
    openSubflow,
    closeMenu: () => setMenu(null),
    closeModal: () => setModal(null),
  }
}
