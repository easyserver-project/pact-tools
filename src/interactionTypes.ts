import { InteractionContent } from './commonInteractions'

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
  TParams extends QueryObject | undefined
> = {
  method: HTTPMethod | methods
  path: string
  pathParams: TParams
  query: TQuery
  headers?: {
    [name: string]: string | MatcherResult
  }
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
  [index: string]: InteractionContent<any, any, any, any>
}
