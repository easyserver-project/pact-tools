import { NewInteraction, parseLikeObject } from './commonInteractions'
import { createFetch, Result } from './fetchInteraction'
import { CreateInteractions, InteractionContent, methods, RequestOptions } from './interactionTypes'

type Pact = any
type likeFunc = <T>(v: T) => {
  contents: T
  getValue: () => T
  json_class: string
}

export const testInteractions = (
  pact: any,
  createInteractions: CreateInteractions,
  newInteraction: () => NewInteraction,
  like: likeFunc,
  fetch: any
) => {
  beforeAll(async () => {
    const baseURL = `http://localhost:${pact.opts.port}`
    if (!globalThis.fetch) {
      // const fetch = require('node-fetch')
      // @ts-ignore
      globalThis.fetch = (input, init) => fetch(baseURL + input, init)
    }
    await pact.setup()
  })
  beforeEach(async () => pact.removeInteractions())
  afterEach(() => pact.verify())
  afterAll(() => pact.finalize())

  // @ts-ignore
  testAllInteractions(pact, createInteractions, newInteraction, like)
  return pact
}

const testAllInteractions = (
  provider: Pact,
  createInteractions: (like: likeFunc) => {
    [index: string]: InteractionContent<any, any, any, any, any, methods>
  },
  newInteraction: () => NewInteraction,
  like: likeFunc
) => {
  // @ts-ignore
  const interactions = createInteractions((v) => like(v))
  for (const interaction of Object.values(interactions)) {
    testOneInteraction(
      provider,
      interaction,
      () =>
        createFetch(interaction)({
          body: parseLikeObject(interaction.withRequest.body),
          query: parseLikeObject(interaction.withRequest.query),
          params: parseLikeObject(interaction.withRequest.pathParams),
          headers: parseLikeObject(interaction.withRequest.headerParams),
        }),
      newInteraction
    )
  }
}

const testOneInteraction = (
  provider: Pact,
  interaction: InteractionContent<any, any, any, any, any, methods>,
  call: () => Promise<Result<any>>,
  newInteraction: () => NewInteraction
) => {
  describe(interaction.uponReceiving, () => {
    for (const given of Object.keys(interaction.given))
      test(given, async () => {
        await provider.addInteraction(
          createInteraction(interaction, given, newInteraction, `${interaction.uponReceiving}_${given}`) as any
        )
        const result = await call()
        if (result.err) {
          expect((result.err as any).response.status).toEqual(interaction.given[given].status)
          expect(result.data).toBeUndefined()
        } else {
          const expected = parseLikeObject(interaction.given[given].body)
          expect(result.err).toBeUndefined()
          expect(result.data).toStrictEqual(expected)
        }
      })
  })
}

const replaceParams = (withRequest: RequestOptions<any, any, any, any, methods>) => {
  const ret = { ...withRequest }
  let path = withRequest.path
  for (const key of Object.keys(withRequest.pathParams)) {
    if (!path.includes(`:${key}`)) throw `:${key} not found in url '${withRequest.path}'`
    path = path.replace(`:${key}`, parseLikeObject(withRequest.pathParams[key]))
  }
  ret.path = path
  const headers = withRequest.headers || {}
  for (const key of Object.keys(withRequest.headerParams)) {
    headers[key] = parseLikeObject(withRequest.headerParams[key])
  }
  ret.headers = headers
  return ret
}
export const createInteraction = (
  content: InteractionContent<any, any, any, any, any, methods>,
  given: string,
  newInteraction: () => NewInteraction,
  givenName: string
) =>
  newInteraction()
    .given(givenName)
    .uponReceiving(content.uponReceiving)
    .withRequest(replaceParams(content.withRequest))
    .willRespondWith(content.given[given])
