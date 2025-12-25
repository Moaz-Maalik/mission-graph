import { DatabaseReader } from '../_generated/server'
import { Id } from '../_generated/dataModel'
import { GraphSubflowResult } from './types'

import { traceComputation } from './traceComputation'
import { showDependents } from './showDependents'
import { showDependencies } from './showDependencies'

export type SubflowHandler = (
  ctx: { db: DatabaseReader },
  componentId: Id<'components'>,
) => Promise<GraphSubflowResult>

export const subflowRegistry: Record<string, SubflowHandler> = {
  traceComputation,
  showDependents,
  showDependencies,
}
