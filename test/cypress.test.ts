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
    interceptInteraction(cy, 'emptyInteraction', 'undefined', createInteractions)
    expect(interceptFn).toHaveBeenCalled()
    expect(asFn).toHaveBeenCalledWith("emptyInteraction")
  })
})
