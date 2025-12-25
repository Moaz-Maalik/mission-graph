import { mutation } from '../_generated/server'
import { v } from "convex/values";
import { validateRelationship } from "../logic/validateRelationship";

export default mutation({
  args: {
    fromComponentId: v.id("components"),
    toComponentId: v.id("components"),
    type: v.string(),
  },
  async handler(ctx, args) {
    await validateRelationship(
      ctx,
      args.fromComponentId,
      args.toComponentId,
      args.type
    );

    await ctx.db.insert("relationships", {
      fromComponentId: args.fromComponentId,
      toComponentId: args.toComponentId,
      type: args.type,
      createdAt: Date.now(),
    });
  },
});
