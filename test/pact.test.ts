import { testInteractions } from '../src'
import { createInteractions } from './interactions'
import { like } from '@pact-foundation/pact/src/dsl/matchers'
import path from 'path'
import { Interaction, Pact } from '@pact-foundation/pact'

const pact = new Pact({
  consumer: 'dummy',
  provider: 'dummy',
  port: 2244,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'info',
})

describe('Pact', () => {
  testInteractions(
    pact,
    createInteractions,
    () => new Interaction(),
    like
  )
})
