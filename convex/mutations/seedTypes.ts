import { mutation } from "../_generated/server";

type ComponentTypeSeed = {
  typeId: string;
  label: string;
  description?: string;

  capabilities: string[];
  constraints: string[];
  subflows: string[];

  allowedIncoming: string[];
  allowedOutgoing: string[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ui?: Record<string, any>;
};

const COMPONENT_TYPES: ComponentTypeSeed[] = [
  {
    typeId: "mission",
    label: "Mission",
    capabilities: ["traceable"],
    constraints: [],
    subflows: [],
    allowedIncoming: [],
    allowedOutgoing: ["has"],
    ui: { icon: "rocket" },
  },
  {
    typeId: "system",
    label: "System",
    capabilities: ["traceable"],
    constraints: [],
    subflows: [],
    allowedIncoming: ["has"],
    allowedOutgoing: ["has"],
    ui: { icon: "cpu" },
  },
  {
    typeId: "requirement",
    label: "Requirement",
    capabilities: ["traceable"],
    constraints: [],
    subflows: [],
    allowedIncoming: ["verifies"],
    allowedOutgoing: ["defines", "verifies"],
    ui: { icon: "clipboard" },
  },
  {
    typeId: "hardwareSpec",
    label: "Hardware Spec",
    capabilities: ["traceable"],
    constraints: [],
    subflows: [],
    allowedIncoming: ["defines"],
    allowedOutgoing: ["has", "owns"],
    ui: { icon: "chip" },
  },
  {
    typeId: "task",
    label: "Task",
    capabilities: ["traceable"],
    constraints: [],
    subflows: [],
    allowedIncoming: ["owns", "fulfills"],
    allowedOutgoing: ["fulfills"],
    ui: { icon: "check" },
  },
  {
    typeId: "value",
    label: "Value",
    capabilities: ["computable", "traceable"],
    constraints: [],
    subflows: ["traceComputation"],
    allowedIncoming: ["computes", "has"],
    allowedOutgoing: [],
    ui: { isComputed: true, icon: "sigma" },
  },
  {
    typeId: "test",
    label: "Test",
    capabilities: ["traceable"],
    constraints: [],
    subflows: [],
    allowedIncoming: ["verifies"],
    allowedOutgoing: ["verifies"],
    ui: { icon: "beaker" },
  },
  {
    typeId: "risk",
    label: "Risk",
    capabilities: ["traceable"],
    constraints: [],
    subflows: [],
    allowedIncoming: [],
    allowedOutgoing: ["has"],
    ui: { icon: "alert" },
  },
  {
    typeId: "file",
    label: "File",
    capabilities: [],
    constraints: [],
    subflows: [],
    allowedIncoming: ["has"],
    allowedOutgoing: [],
    ui: { icon: "file" },
  },
];

export default mutation({
  args: {},
  async handler(ctx) {
    for (const type of COMPONENT_TYPES) {
      const existing = await ctx.db
        .query("componentTypes")
        .withIndex("by_typeId", (q) => q.eq("typeId", type.typeId))
        .first();

      if (existing) continue;

      await ctx.db.insert("componentTypes", type);
    }
  },
});
