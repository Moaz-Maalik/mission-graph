import { mutation } from '../_generated/server'
import { v } from 'convex/values'

export default mutation({
  args: {
    componentId: v.id('components'),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.componentId, {
      position: args.position,
      updatedAt: Date.now(),
    })
  },
})
