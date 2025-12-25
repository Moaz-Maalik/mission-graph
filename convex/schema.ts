import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  componentTypes: defineTable({
    typeId: v.string(),
    label: v.string(),
    description: v.optional(v.string()),

    capabilities: v.array(v.string()),
    constraints: v.array(v.string()),
    subflows: v.array(v.string()),

    allowedIncoming: v.array(v.string()),
    allowedOutgoing: v.array(v.string()),

    ui: v.optional(v.any()),
  }).index("by_typeId", ["typeId"]),

  components: defineTable({
    label: v.string(),
    typeId: v.string(),
    data: v.any(),
    computedState: v.optional(v.any()),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  relationships: defineTable({
    fromComponentId: v.id("components"),
    toComponentId: v.id("components"),
    type: v.string(),
    createdAt: v.number(),
  })
    .index("by_from", ["fromComponentId"])
    .index("by_to", ["toComponentId"])
    .index("by_type", ["type"]),
});
