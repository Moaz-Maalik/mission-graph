import { DatabaseReader } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { GraphSubflowResult } from "./types";

export async function showDependencies(
  ctx: { db: DatabaseReader },
  componentId: Id<"components">
): Promise<GraphSubflowResult> {
  const visited = new Set<string>();
  const nodes: GraphSubflowResult["nodes"] = [];
  const edges: GraphSubflowResult["edges"] = [];

  async function visit(id: Id<"components">) {
    if (visited.has(id)) return;
    visited.add(id);

    const component = await ctx.db.get(id);
    if (!component) return;

    nodes.push({
      id: component._id,
      label: component.label,
      typeId: component.typeId,
    });

    const incoming = await ctx.db
      .query("relationships")
      .withIndex("by_to", (q) => q.eq("toComponentId", id))
      .filter((q) => q.eq(q.field("type"), "computes"))
      .collect();

    if (incoming.length === 0) {
      return; 
    }

    for (const rel of incoming) {
      edges.push({
        from: rel.fromComponentId,
        to: rel.toComponentId,
        type: rel.type,
      });

      await visit(rel.fromComponentId);
    }
  }

  await visit(componentId);

  return { nodes, edges };
}
