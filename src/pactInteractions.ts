import { Interaction, Pact } from '@pact-foundation/pact'
import { InteractionContent, parseLikeObject } from './commonInteractions'
import { fetchInteraction, Result } from './fetchInteraction'
import { like } from '@pact-foundation/pact/src/dsl/matchers'
import path from 'path'
import axios from 'axios'
import { CreateInteractions, RequestOptions } from './interactionTypes'

export const testInteractions = (
  consumer: string,
  provider: string,
  createInteractions: CreateInteractions
) => {
  const pact = new Pact({
    consumer,
    provider,
    port: 2244,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'info',
  })

  beforeAll(async () => {
    axios.defaults.baseURL = 'http://localhost:2244'
    await pact.setup()
  })
  beforeEach(async () => pact.removeInteractions())
  afterEach(() => pact.verify())
  afterAll(() => pact.finalize())

  testAllInteractions(pact, createInteractions)
  return pact
}

const testAllInteractions = (
  provider: Pact,
  createInteractions: (like: <T>(v: T) => T) => {
    [index: string]: InteractionContent<any, any, any, any, any>
  }
) => {
  // @ts-ignore
  const interactions = createInteractions((v) => like(v))
  for (const interaction of Object.values(interactions)) {
    testOneInteraction(provider, interaction, () =>
      fetchInteraction(interaction, {
        body: parseLikeObject(interaction.withRequest.body),
        query: parseLikeObject(interaction.withRequest.query),
        params: parseLikeObject(interaction.withRequest.pathParams),
        headers: parseLikeObject(interaction.withRequest.headerParams),
      })
    )
  }
}

const testOneInteraction = (
  provider: Pact,
  interaction: InteractionContent<any, any, any, any, any>,
  call: () => Promise<Result<any>>
) => {
  describe(interaction.uponReceiving, () => {
    for (const given of Object.keys(interaction.given))
      test(given, async () => {
        await provider.addInteraction(createInteraction(interaction, given))
        const result = await call()
        if (result.err) {
          expect((result.err as any).response.status).toEqual(
            interaction.given[given].status
          )
          expect(result.data).toBeUndefined()
        } else {
          const expected = parseLikeObject(interaction.given[given].body)
          expect(result.err).toBeUndefined()
          expect(result.data).toStrictEqual(expected)
        }
      })
  })
}

const replaceParams = (withRequest: RequestOptions<any, any, any, any>) => {
  const ret = { ...withRequest }
  if (withRequest.pathParams) {
    let path = withRequest.path
    for (const key of Object.keys(withRequest.pathParams)) {
      if (!path.includes(`:${key}`))
        throw `:${key} not found in url '${withRequest.path}'`
      path = path.replace(`:${key}`, withRequest.pathParams[key])
    }
    ret.path = path
  }
  if (withRequest.headerParams) {
    const headers = withRequest.headers || {}
    for (const key of Object.keys(withRequest.headerParams)) {
      headers[key] = parseLikeObject(withRequest.headerParams[key])
    }
    withRequest.headers = headers
  }
  return ret
}
export const createInteraction = (
  content: InteractionContent<any, any, any, any, any>,
  given: string
) =>
  new Interaction()
    .given(given)
    .uponReceiving(content.uponReceiving)
    .withRequest(replaceParams(content.withRequest))
    .willRespondWith(content.given[given])
