import {MatcherResult, RequestOptions} from './interactionTypes'

export type InteractionContent<TBody, TRes> = {
    given: {
        [index: string]: {
            status: number | MatcherResult;
            headers?: {
                [name: string]: string | MatcherResult;
            };
            body: TRes;
        }
    }
    uponReceiving: string
    withRequest: RequestOptions<TBody>
}

export function parseLikeObject(obj: any): any {
    if (!obj) return undefined
    const value = obj.hasOwnProperty('getValue') ? obj.getValue() : obj
    if (Array.isArray(value))
        return value.map(d => typeof d === 'object'
            ? parseLikeObject(d)
            : d)
    if (typeof value === 'object')
        return Object.keys(value).reduce((acc, cur) => {
            const propValue = value[cur]
            acc[cur] =
                typeof propValue === 'object'
                    ? parseLikeObject(propValue)
                    : propValue
            return acc
        }, {} as any)
    else return value
}

export type Itt<T> = InteractionType<T>
export type InteractionType<T> = {
    contents: T;
    getValue: () => T;
    json_class: string;
} | T
