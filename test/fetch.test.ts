import { createInteraction, testInteractions } from '../src/pactInteractions'
import { createInteractions } from './interactions'
import { like } from '@pact-foundation/pact/src/dsl/matchers'
import { createFetch } from '../src/fetchInteraction'
import path from 'path'
import { Interaction, Pact } from '@pact-foundation/pact'
import { NewInteraction } from '../src/commonInteractions'

const pact = new Pact({
  consumer: 'dummy',
  provider: 'dummy',
  port: 2244,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'info',
})

describe('Pact', () => {
  const provider = testInteractions(
    pact,
    createInteractions,
    () => new Interaction() as NewInteraction,
    like
  )

  test('manual', async () => {
    // @ts-ignore
    const interactions = createInteractions((v) => like(v))
    await provider.addInteraction(
      createInteraction(
        interactions.emptyInteraction,
        'undefined',
        () => new Interaction() as NewInteraction
      )
    )
    const result = await createFetch(interactions.emptyInteraction)({
      body: { name: 'dsflijshlik' },
      query: {},
      headers: {},
      params: {},
    })
  })
})
