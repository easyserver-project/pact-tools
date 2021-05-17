import { createInteraction, testInteractions } from '../src/pactInteractions'
import { createInteractions } from './interactions'
import { like } from '@pact-foundation/pact/src/dsl/matchers'
import { createFetch } from '../src/fetchInteraction'

describe('Pact', () => {
  const provider = testInteractions('dummy', 'dummy', createInteractions)

  test('manual', async () => {
    // @ts-ignore
    const interactions = createInteractions((v) => like(v))
    await provider.addInteraction(
      createInteraction(interactions.emptyInteraction, 'undefined')
    )
    const result = await createFetch(interactions.emptyInteraction)({
      body: { name: 'dsflijshlik' },
      query: {},
      headers: {},
      params: {},
    })
  })
})
