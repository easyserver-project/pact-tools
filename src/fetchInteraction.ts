import {InteractionContent} from './commonInteractions'
import axios from 'axios'

export interface Result<T> extends VoidResult {
    data?: T
}

export interface VoidResult {
    err?: Error
}

export type FetchInteractionOptions<TReq> = {
    body: TReq
    headers?: { [index: string]: string }
}

export async function fetchInteraction<TBody, TRes>(interaction: InteractionContent<TBody, TRes>, options: FetchInteractionOptions<TBody>): Promise<Result<TRes>> {
    let headers = (Object.keys(interaction.withRequest.headers!) || []).reduce((acc, cur) => {
        // @ts-ignore
        acc[cur] = interaction.withRequest.headers![cur].getValue ? interaction.withRequest.headers![cur].getValue() : interaction.withRequest.headers![cur].toString()
        return acc
    }, {} as any)
    headers = {...headers, ...options.headers}
    const url = interaction.withRequest.path.toString()
    const body = JSON.stringify(options.body)
    const method = interaction.withRequest.method
    let call: Promise<any>
    switch (method) {
        case 'GET':
            call = axios.get(url, {headers});
            break
        case 'POST':
            call = axios.post(url, body, {headers});
            break
        case 'PUT':
            call = axios.put(url, body, {headers});
            break
        default:
            throw 'Not implemented'
    }
    return call.then(d => {
        if (d.data === "") return {}
        return ({data: d.data as TRes})
    }).catch(e => ({err: e}))
}