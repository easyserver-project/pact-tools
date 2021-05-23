import { Cy, interceptInteraction } from '../src'
import { createTestInteractions } from './testInteractions'

describe('Cypress', () => {
  test('Intercept', async () => {
    const asFn = jest.fn()
    const interceptFn = jest.fn().mockImplementation(() => ({
      as: asFn,
    }))
    const cy: Cy = {
      intercept: interceptFn,
    }
    interceptInteraction(cy, 'pathParamsInteraction', 'success', createTestInteractions)
    expect(interceptFn).toHaveBeenCalledWith('GET', '/api/name/*/*', {
      body: { responseId: 'something' },
      statusCode: 200,
    })
    expect(asFn).toHaveBeenCalledWith('pathParamsInteraction')
  })
})
