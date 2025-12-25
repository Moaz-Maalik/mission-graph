import { query } from '../_generated/server'

export default query(async (ctx) => {
  const components = await ctx.db.query('components').collect()
  const relationships = await ctx.db.query('relationships').collect()

  return {
    components,
    relationships,
  }
})
