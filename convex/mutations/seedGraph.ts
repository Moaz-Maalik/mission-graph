import { mutation } from '../_generated/server'

export default mutation(async (ctx) => {
  const a = await ctx.db.insert("components", {
    label: "A",
    typeId: "source",
    data: { value: 10 },
    position: { x: 100, y: 100 },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  const b = await ctx.db.insert("components", {
    label: "B",
    typeId: "source",
    data: { value: 20 },
    position: { x: 100, y: 300 },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  const c = await ctx.db.insert("components", {
    label: "C",
    typeId: "computed",
    data: {},
    computedState: { value: 30 },
    position: { x: 400, y: 200 },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  await ctx.db.insert("relationships", {
    fromComponentId: a,
    toComponentId: c,
    type: "computes",
    createdAt: Date.now(),
  })

  await ctx.db.insert("relationships", {
    fromComponentId: b,
    toComponentId: c,
    type: "computes",
    createdAt: Date.now(),
  })
})
