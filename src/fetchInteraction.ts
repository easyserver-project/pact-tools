import { InteractionContent } from './commonInteractions'
import axios from 'axios'
import { QueryObject } from './interactionTypes'

export interface Result<T> extends VoidResult {
  data?: T
}

export interface VoidResult {
  err?: Error
}

export type FetchInteractionOptions<
  TBody,
  TQuery extends QueryObject,
  TParams extends QueryObject,
  THeaders extends QueryObject
> = {
  body: TBody
  query: TQuery
  params: TParams
  headers: THeaders
}

export function createFetch<
  TBody,
  TRes,
  TQuery extends QueryObject,
  TParams extends QueryObject,
  THeaders extends QueryObject
>(interaction: InteractionContent<TBody, TRes, TQuery, TParams, THeaders>) {
  return async (
    options: FetchInteractionOptions<TBody, TQuery, TParams, THeaders>
  ) => fetchInteraction(interaction, options)
}

async function fetchInteraction<
  TBody,
  TRes,
  TQuery extends QueryObject,
  TParams extends QueryObject,
  THeaders extends QueryObject
>(
  interaction: InteractionContent<TBody, TRes, TQuery, TParams, THeaders>,
  options: FetchInteractionOptions<TBody, TQuery, TParams, THeaders>
): Promise<Result<TRes>> {
  let headers = interaction.withRequest.headers
    ? (Object.keys(interaction.withRequest.headers!) || []).reduce(
        (acc, cur) => {
          // @ts-ignore
          acc[cur] = interaction.withRequest.headers![cur].getValue
            ? // @ts-ignore
              interaction.withRequest.headers![cur].getValue()
            : interaction.withRequest.headers![cur].toString()
          return acc
        },
        {} as any
      )
    : {}
  if (interaction.withRequest.headerParams) {
    for (const key of Object.keys(interaction.withRequest.headerParams)) {
      headers[key] = options.headers[key]
    }
  }
  let url = interaction.withRequest.path.toString()

  // Replace params in url
  if (options.params && Object.keys(options.params).length > 0) {
    for (const key of Object.keys(options.params)) {
      url = url.replace(`:${key}`, options.params[key])
    }
  }

  // Insert query into url
  if (options.query && Object.keys(options.query).length > 0)
    url += `?${Object.keys(options.query)
      .map((key) => `${key}=${options?.query[key]}`)
      .join('&')}`

  const body = JSON.stringify(options.body)
  const method = interaction.withRequest.method
  let call: Promise<any>
  switch (method) {
    case 'GET':
      call = axios.get(url, { headers })
      break
    case 'POST':
      call = axios.post(url, body, { headers })
      break
    case 'PUT':
      call = axios.put(url, body, { headers })
      break
    default:
      throw 'Not implemented'
  }
  return call
    .then((d) => {
      if (d.data === '') return {}
      return { data: d.data as TRes }
    })
    .catch((e) => ({ err: e }))
}
