import { createTestInteractions, interactionsWithoutLikeFunc } from './testInteractions'
import { parseLikeObject } from '../src/commonInteractions'
import { string } from '@pact-foundation/pact/src/dsl/matchers'
import {createFetch} from "../src/fetchInteraction";

declare const expect: jest.Expect

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

  test('without like', async () => {
    globalThis.fetch = jest.fn().mockImplementation(() => new Promise((resolve) => resolve({ json: () => ({}) })))
    const interaction = interactionsWithoutLikeFunc.demoInteraction
    await createFetch(interaction)({
      body: undefined,
      query: {},
      headers: { Authorization: 'token' },
      params: {},
    })
    expect(global.fetch).toHaveBeenCalledWith(interaction.withRequest.path, {
      headers: interaction.withRequest.headerParams,
      method: interaction.withRequest.method,
    })
  })
})
