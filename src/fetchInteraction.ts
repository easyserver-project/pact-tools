import { InteractionContent } from './commonInteractions'
import axios from 'axios'

export interface Result<T> extends VoidResult {
  data?: T
}

export interface VoidResult {
  err?: Error
}

export async function fetchInteraction<TReq, TRes>(interaction: InteractionContent<TReq, TRes>, request: TReq, extraHeaders?: { [index: string]: string }): Promise<Result<TRes>> {
  let headers = (Object.keys(interaction.withRequest.headers!) || []).reduce((acc, cur) => {
    // @ts-ignore
    acc[cur] = interaction.withRequest.headers![cur].getValue ? interaction.withRequest.headers![cur].getValue() : interaction.withRequest.headers![cur].toString()
    return acc
  }, {} as any)
  headers = { ...headers, ...extraHeaders }
  const url = interaction.withRequest.path.toString()
  const body = JSON.stringify(request)
  const method = interaction.withRequest.method
  switch (method) {
    case 'GET':
      return axios.get(url, { headers }).then(d => ({ data: d.data as TRes })).catch(e => ({ err: e }))
    case 'POST':
      return axios.post(url, body, { headers }).then(d => ({ data: d.data as TRes })).catch(e => ({ err: e }))
    case 'PUT':
      return axios.put(url, body, { headers }).then(d => ({ data: d.data as TRes })).catch(e => ({ err: e }))
    default:
      throw 'Not implemented'
  }
}