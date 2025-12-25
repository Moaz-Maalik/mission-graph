import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { subflowRegistry } from "../subflows/registry";

export default mutation({
  args: {
    componentId: v.id("components"),
    subflow: v.string(),
  },
  async handler(ctx, args) {
    const component = await ctx.db.get(args.componentId);
    if (!component) {
      throw new Error("Component not found");
    }

    const componentType = await ctx.db
      .query("componentTypes")
      .withIndex("by_typeId", (q) =>
        q.eq("typeId", component.typeId)
      )
      .first();

    if (!componentType) {
      throw new Error("Component type not found");
    }

    if (!componentType.subflows.includes(args.subflow)) {
      throw new Error(
        `Subflow '${args.subflow}' not allowed for ${component.typeId}`
      );
    }

    const handler = subflowRegistry[args.subflow];
    if (!handler) {
      throw new Error(
        `Subflow '${args.subflow}' is not registered`
      );
    }

    return await handler(ctx, args.componentId);
  },
});
