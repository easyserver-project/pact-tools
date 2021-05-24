import { createTestInteractions } from './testInteractions'
import { createFetch } from '../src'
import { parseLikeObject } from '../src/commonInteractions'

describe('Fetch', () => {
  test('manual', async () => {
    globalThis.fetch = jest.fn().mockImplementation(() => new Promise((resolve) => resolve({ json: () => ({}) })))
    const interaction = createTestInteractions().emptyInteraction
    const body = { name: 'dsflijshlik' }
    await createFetch(interaction)({
      body,
      query: {},
      headers: {},
      params: {},
    })
    expect(global.fetch).toHaveBeenCalledWith(interaction.withRequest.path, {
      body: JSON.stringify(body),
      headers: parseLikeObject(interaction.withRequest.headers),
      method: interaction.withRequest.method,
    })
  })
})
