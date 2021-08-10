import { createTestInteractions, interactionsWithoutLikeFunc } from './testInteractions'
import { like } from '@pact-foundation/pact/src/dsl/matchers'
import path from 'path'
import { Interaction, Pact } from '@pact-foundation/pact'
import * as fs from 'fs'
import {testInteractions, testInteractionsSimple} from '../src/pactInteractions'
import { Interactions } from '../src/interactionTypes'

declare const expect: jest.Expect

const pact = new Pact({
  consumer: 'dummy',
  provider: 'dummy',
  port: 4502,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'info',
})

describe('Pact', () => {
  beforeAll(async () => await pact.setup())
  afterAll(async () => await pact.finalize())
  testInteractions(pact, createTestInteractions, () => new Interaction(), like, require('node-fetch'), true)
  testInteractionsSimple(pact, interactionsWithoutLikeFunc, true)
})

describe('Pact headers', () => {
  test('authorization header', async () => {
    const pactFile = JSON.parse(fs.readFileSync('./pacts/dummy-dummy.json', 'utf8'))
    const interactions = createTestInteractions() as Interactions
    const withAuthHeaders = Object.keys(interactions)
      .filter((key) => interactions[key].withRequest.headerParams?.Authorization)
      .map((key) => interactions[key])
    for (const interaction of withAuthHeaders) {
      const found = pactFile.interactions.filter((d: any) => d.description === interaction.uponReceiving)
      for (const given of found) {
        expect(given?.request?.headers?.Authorization).toBeTruthy()
      }
    }
  })
})
