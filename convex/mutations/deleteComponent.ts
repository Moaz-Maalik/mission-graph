import { mutation } from '../_generated/server'
import { v } from 'convex/values'

export default mutation({
  args: {
    componentId: v.id('components'),
  },
  async handler(ctx, { componentId }) {
    // delete incoming edges
    const incoming = await ctx.db
      .query('relationships')
      .withIndex('by_to', (q) => q.eq('toComponentId', componentId))
      .collect()

    // delete outgoing edges
    const outgoing = await ctx.db
      .query('relationships')
      .withIndex('by_from', (q) => q.eq('fromComponentId', componentId))
      .collect()

    for (const edge of [...incoming, ...outgoing]) {
      await ctx.db.delete(edge._id)
    }

    // finally delete component
    await ctx.db.delete(componentId)
  },
})
