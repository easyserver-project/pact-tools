import { createInteractions } from './interactions'
import { createFetch } from '../src'
import axios from 'axios'

describe('Fetch', () => {
  test('manual', async () => {
    jest.mock('axios')
    axios.put = jest.fn().mockImplementation(() => new Promise<string>((resolve) => resolve('')))
    const interaction = createInteractions().emptyInteraction
    await createFetch(interaction)({
      body: { name: 'dsflijshlik' },
      query: {},
      headers: {},
      params: {},
    })
    expect(axios.put).toHaveBeenCalledWith(
      interaction.withRequest.path,
      JSON.stringify({ name: 'dsflijshlik' }),
      { headers: interaction.withRequest.headers }
    )
  })
})
