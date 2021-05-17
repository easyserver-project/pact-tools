import { testInteractions } from '../src/pactInteractions'
import { createInteractions } from './interactions'

describe('Pact', () => {
  testInteractions('dummy', 'dummy', createInteractions)
})
