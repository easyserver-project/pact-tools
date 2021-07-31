export declare type methods =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'COPY'
  | 'LOCK'
  | 'MKCOL'
  | 'MOVE'
  | 'PROPFIND'
  | 'PROPPATCH'
  | 'UNLOCK'
  | 'REPORT'

export type RequestOptions<TBody,
  TQuery extends QueryObject | undefined,
  TParams extends QueryObject | undefined,
  THeaders extends QueryObject | undefined,
  TMethod extends methods> = {
  method: TMethod
  path: string
  pathParams: TParams
  query: TQuery
  headers?: {
    [name: string]: string | MatcherResult
  }
  headerParams: THeaders
  body: TBody
}

export type MatcherResult = {
  json_class: string
  getValue(): any
}

export interface QueryObject {
  [name: string]: string
}

export type LikeFunc = <T>(v: T) => T
export type CreateInteractions = (like: LikeFunc) => {
  [index: string]: InteractionContent<any, any, any, any, any, methods>
}

export interface InteractionContent<TBody,
  TRes,
  TQuery extends QueryObject,
  TParams extends QueryObject,
  THeaders extends QueryObject,
  TMethod extends methods> {
  given: {
    [index: string]: {
      status: number | MatcherResult
      headers?: {
        [name: string]: string | MatcherResult
      }
      body: TRes | undefined
    }
  }
  transitions?: { [alias: string]: string }
  uponReceiving: string
  withRequest: RequestOptions<TBody, TQuery, TParams, THeaders, TMethod>
}

export interface GetInteraction<T> extends InteractionContent<void, T, {}, {}, { Authorization: string }, 'GET'> {
}

export interface GetQueryInteraction<T, Q extends QueryObject> extends InteractionContent<void, T, Q, {}, { Authorization: string }, 'GET'> {
}

export interface GetParamsInteraction<T, P extends QueryObject> extends InteractionContent<void, T, {}, P, { Authorization: string }, 'GET'> {
}

export interface PostInteraction<T> extends InteractionContent<T, void, {}, {}, { Authorization: string }, 'POST'> {
}

export interface PostParamsInteraction<T, P extends QueryObject> extends InteractionContent<T, void, {}, P, { Authorization: string }, 'POST'> {
}

export interface PutInteraction<T> extends InteractionContent<T, void, {}, {}, { Authorization: string }, 'PUT'> {
}

export interface PutParamsInteraction<T, P extends QueryObject> extends InteractionContent<T, void, {}, P, { Authorization: string }, 'PUT'> {
}
