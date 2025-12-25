import { DatabaseWriter } from '../_generated/server'
import { Id } from '../_generated/dataModel'

export async function validateRelationship(
  ctx: { db: DatabaseWriter },
  fromId: Id<'components'>,
  toId: Id<'components'>,
  type: string,
) {
  if (fromId === toId) {
    throw new Error('A node cannot connect to itself')
  }

  const from = await ctx.db.get(fromId)
  const to = await ctx.db.get(toId)

  if (!from || !to) {
    throw new Error('Invalid node reference')
  }

  const fromType = await ctx.db
    .query('componentTypes')
    .filter((q) => q.eq(q.field('typeId'), from.typeId))
    .first()

  const toType = await ctx.db
    .query('componentTypes')
    .filter((q) => q.eq(q.field('typeId'), to.typeId))
    .first()

  if (!fromType || !toType) {
    throw new Error('Invalid component type')
  }

  if (!fromType.allowedOutgoing.includes(type)) {
    throw new Error(`${from.typeId} cannot create '${type}' relationships`)
  }

  if (!toType.allowedIncoming.includes(type)) {
    throw new Error(`${to.typeId} cannot receive '${type}' relationships`)
  }

  const existing = await ctx.db
    .query('relationships')
    .withIndex('by_from', (q) => q.eq('fromComponentId', fromId))
    .filter((q) =>
      q.and(q.eq(q.field('toComponentId'), toId), q.eq(q.field('type'), type)),
    )
    .first()

  if (existing) {
    throw new Error('Relationship already exists')
  }
}
