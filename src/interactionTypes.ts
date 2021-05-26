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

export declare enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  COPY = 'COPY',
  LOCK = 'LOCK',
  MKCOL = 'MKCOL',
  MOVE = 'MOVE',
  PROPFIND = 'PROPFIND',
  PROPPATCH = 'PROPPATCH',
  UNLOCK = 'UNLOCK',
  REPORT = 'REPORT',
}

export type RequestOptions<
  TBody,
  TQuery extends QueryObject | undefined,
  TParams extends QueryObject | undefined,
  THeaders extends QueryObject | undefined
> = {
  method: HTTPMethod | methods
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

export declare type Query = QueryObject

export type LikeFunc = <T>(v: T) => T
export type CreateInteractions = (like: LikeFunc) => {
  [index: string]: InteractionContent<any, any, any, any, any>
}

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

export interface GetInteraction<T> extends InteractionContent<void, T, {}, {}, { Authorization: string }> {
}

export interface GetQueryInteraction<T, Q extends QueryObject> extends InteractionContent<void, T, Q, {}, { Authorization: string }> {
}

export interface GetParamsInteraction<T, P extends QueryObject> extends InteractionContent<void, T, {}, P, { Authorization: string }> {
}

export interface PostInteraction<T> extends InteractionContent<T, void, {}, {}, { Authorization: string }> {
}

export interface PostParamsInteraction<T, P extends QueryObject> extends InteractionContent<T, void, {}, P, { Authorization: string }> {
}
