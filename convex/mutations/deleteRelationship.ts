import { mutation } from '../_generated/server'
import { v } from 'convex/values'

export default mutation({
  args: {
    relationshipId: v.id('relationships'),
  },
  async handler(ctx, { relationshipId }) {
    await ctx.db.delete(relationshipId)
  },
})
