import { MatcherResult, QueryObject, RequestOptions } from './interactionTypes'

export interface InteractionContent<
  TBody,
  TRes,
  TQuery extends QueryObject,
  TParams extends QueryObject,
  THeaders extends QueryObject
> {
  given: {
    [index: string]: {
      status: number | MatcherResult
      headers?: {
        [name: string]: string | MatcherResult
      }
      body: TRes | undefined
    }
  }
  uponReceiving: string
  withRequest: RequestOptions<TBody, TQuery, TParams, THeaders>
}

export function parseLikeObject(obj: any): any {
  if (!obj) return undefined
  const value = obj.hasOwnProperty('getValue') ? obj.getValue() : obj
  if (Array.isArray(value))
    return value.map((d) => (typeof d === 'object' ? parseLikeObject(d) : d))
  if (typeof value === 'object')
    return Object.keys(value).reduce((acc, cur) => {
      const propValue = value[cur]
      acc[cur] =
        typeof propValue === 'object' ? parseLikeObject(propValue) : propValue
      return acc
    }, {} as any)
  else return value
}
