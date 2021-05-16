import { testInteractions } from '../src/pactInteractions'
import { createInteractions } from './interactions'

describe('Pact', () => {
  const provider = testInteractions('dummy', 'dummy', createInteractions)
})
