import { mutation } from '../_generated/server'
import { v } from 'convex/values'
import { recompute } from '../logic/recompute'

export default mutation({
  args: {
    componentId: v.id('components'),
    value: v.number(),
  },
  async handler(ctx, args) {
    const component = await ctx.db.get(args.componentId)
    if (!component) {
      throw new Error('Component not found')
    }

    const type = await ctx.db
      .query('componentTypes')
      .withIndex('by_typeId', (q) => q.eq('typeId', component.typeId))
      .first()

    if (!type?.capabilities.includes('editable')) {
      throw new Error('Component is not editable')
    }

    await ctx.db.patch(args.componentId, {
      data: {
        ...(component.data ?? {}),
        value: args.value,
      },
      updatedAt: Date.now(),
    })

    await recompute(ctx, args.componentId)
  },
})
