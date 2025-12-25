import { mutation } from '../_generated/server'
import { v } from 'convex/values'
import { recompute } from '../logic/recompute'

export const updateComponentData = mutation({
  args: {
    componentId: v.id('components'),
    data: v.any(),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.componentId, {
      data: args.data,
      updatedAt: Date.now(),
    })

    await recompute(ctx, args.componentId)
  },
})
