import { InteractionContent, testInteractions } from '../src'
import { createTestInteractions } from './testInteractions'
import { like } from '@pact-foundation/pact/src/dsl/matchers'
import path from 'path'
import { Interaction, Pact } from '@pact-foundation/pact'
import * as fs from 'fs'

const pact = new Pact({
  consumer: 'dummy',
  provider: 'dummy',
  port: 4500,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'info',
})

describe('Pact', () => {
  testInteractions(pact, createTestInteractions, () => new Interaction(), like, require('node-fetch'))
})

// describe("Pact headers", ()=>{
//   test('authorization header', async () => {
//     const pactFile = JSON.parse(fs.readFileSync('./pacts/dummy-dummy.json', 'utf8'))
//     const interactions = createTestInteractions() as { [index: string]: InteractionContent<any, any, any, any, any> }
//     const withAuthHeaders = Object.keys(interactions)
//         .filter((key) => interactions[key].withRequest.headerParams?.Authorization)
//         .map((key) => interactions[key])
//     for (const interaction of withAuthHeaders) {
//       const found = pactFile.interactions.filter((d: any) => d.description === interaction.uponReceiving)
//       for (const given of found) {
//         expect(given?.request?.headers?.Authorization).toBeTruthy()
//       }
//     }
//   })
// })