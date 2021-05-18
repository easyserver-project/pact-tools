import { Cy, interceptInteraction } from '../src'
import { createInteractions } from './interactions'

describe('Cypress', () => {
  test('Intercept', async () => {
    const asFn = jest.fn()
    const interceptFn = jest.fn().mockImplementation(() => ({
      as: asFn,
    }))
    const cy: Cy = {
      intercept: interceptFn,
    }
    interceptInteraction(cy, 'pathParamsInteraction', 'success', createInteractions)
    expect(interceptFn).toHaveBeenCalledWith('GET', '/api/*/*', {
      body: { responseId: 'something' },
      statusCode: 200,
    })
    expect(asFn).toHaveBeenCalledWith('pathParamsInteraction')
  })
})
