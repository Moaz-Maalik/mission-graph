'use client'

import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

import { SubflowModal } from '@/components/SubflowModal'
import { useGraphSubflowContext } from '@/context/GraphSubflowContext'
import { ComponentCatalog } from './components/ComponentCatalog'
import { GraphView } from './components/GraphView'
import { Menu } from './components/Menu'

export function GraphPage() {
  const graph = useQuery(api.queries.getGraph.default)
  const { menu, modal, openSubflow, closeMenu, closeModal } =
    useGraphSubflowContext()

  return (
    <div className="flex h-screen">
      <ComponentCatalog />
      <div className="flex-1">
        {graph && <GraphView graph={graph} />}

        {menu && (
          <Menu menu={menu} openSubflow={openSubflow} closeMenu={closeMenu} />
        )}

        {modal && (
          <SubflowModal
            title={modal.title}
            result={modal.result}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  )
}
