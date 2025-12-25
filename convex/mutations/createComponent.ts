import { mutation } from '../_generated/server'

import { v } from 'convex/values'

export default mutation({
  args: {
    label: v.string(),
    typeId: v.string(),
    position: v.object({ x: v.number(), y: v.number() }),
  },
  async handler(ctx, args) {
    await ctx.db.insert('components', {
      label: args.label,
      typeId: args.typeId,
      data: {},
      position: args.position,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  },
})
