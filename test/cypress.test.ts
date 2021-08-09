import { Cy, interceptInteraction } from '../src'
import { createTestInteractions } from './testInteractions'
import { prepareIntercepts } from '../src/cypressInteractions'

declare const expect: jest.Expect

describe('Cypress', () => {
  test('Intercept path params', async () => {
    const asFn = jest.fn()
    const interceptFn = jest.fn().mockImplementation(() => ({
      as: asFn,
    }))
    const cy: Cy = {
      intercept: interceptFn,
      wait: jest.fn(),
    }
    interceptInteraction(cy, 'pathParamsInteraction', 'success', createTestInteractions)
    expect(interceptFn).toHaveBeenCalledWith('GET', '/api/name/*/*', {
      body: { responseId: 'something' },
      statusCode: 200,
    })
    expect(asFn).toHaveBeenCalledWith('pathParamsInteraction')
  })

  test('Intercept query', async () => {
    const asFn = jest.fn()
    const interceptFn = jest.fn().mockImplementation(() => ({
      as: asFn,
    }))
    const cy: Cy = {
      intercept: interceptFn,
      wait: jest.fn(),
    }
    interceptInteraction(cy, 'queryInteraction', 'success', createTestInteractions)
    expect(interceptFn).toHaveBeenCalledWith('POST', '/api/query*', {
      body: { responseId: 'something' },
      statusCode: 200,
    })
    expect(asFn).toHaveBeenCalledWith('queryInteraction')
  })

  test('Intercept all', async () => {
    const asFn = jest.fn()
    const interceptFn = jest.fn().mockImplementation(() => ({
      as: asFn,
    }))
    const cy: Cy = {
      intercept: interceptFn,
      wait: jest.fn(),
    }
    prepareIntercepts(cy, createTestInteractions)
    expect(interceptFn).toHaveBeenCalledTimes(Object.keys(createTestInteractions()).length)
  })
})
