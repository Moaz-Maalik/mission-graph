import { DatabaseWriter } from '../_generated/server'
import { Id } from '../_generated/dataModel'

export async function recompute(
  ctx: { db: DatabaseWriter },
  componentId: Id<'components'>,
) {
  const edges = await ctx.db
    .query('relationships')
    .withIndex('by_from', (q) => q.eq('fromComponentId', componentId))
    .filter((q) => q.eq(q.field('type'), 'computes'))
    .collect()

  for (const edge of edges) {
    const target = await ctx.db.get(edge.toComponentId)
    if (!target) continue

    const inputs = await ctx.db
      .query('relationships')
      .withIndex('by_to', (q) => q.eq('toComponentId', target._id))
      .filter((q) => q.eq(q.field('type'), 'computes'))
      .collect()

    let sum = 0

    for (const input of inputs) {
      const source = await ctx.db.get(input.fromComponentId)
      if (!source) continue

      sum += source.data?.value ?? source.computedState?.value ?? 0
    }

    await ctx.db.patch(target._id, {
      computedState: { value: sum },
      updatedAt: Date.now(),
    })

    await recompute(ctx, target._id)
  }
}
