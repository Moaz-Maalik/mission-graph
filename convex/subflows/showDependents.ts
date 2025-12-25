import { SubflowHandler } from './registry'
import { Id } from '../_generated/dataModel'

export const showDependents: SubflowHandler = async (ctx, componentId) => {
  const visited = new Set<string>()
  const nodes: Map<string, { id: string; label: string; typeId: string }> =
    new Map()
  const edges: { from: string; to: string; type: string }[] = []

  async function walk(sourceId: Id<'components'>) {
    if (visited.has(sourceId)) return
    visited.add(sourceId)

    const component = await ctx.db.get(sourceId)
    if (!component) return

    nodes.set(sourceId, {
      id: sourceId,
      label: component.label,
      typeId: component.typeId,
    })

    const outgoing = await ctx.db
      .query('relationships')
      .withIndex('by_from', (q) => q.eq('fromComponentId', sourceId))
      .collect()

    for (const edge of outgoing) {
      edges.push({
        from: edge.fromComponentId,
        to: edge.toComponentId,
        type: edge.type,
      })

      await walk(edge.toComponentId)
    }
  }

  await walk(componentId)

  return {
    nodes: Array.from(nodes.values()),
    edges,
  }
}
