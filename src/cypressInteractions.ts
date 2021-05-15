import { parseLikeObject } from './commonInteractions'
import { CreateInteractions, methods } from './interactionTypes'

export const interceptInteraction = (
  cy: { intercept(method: methods, url: string, response?: any): any },
  alias: string,
  given: string,
  createInteractions: CreateInteractions,
  host?: string
) => {
  const interaction = (createInteractions(v => v) as any)[alias]
  const method = interaction.withRequest.method
  const url = (host || '') + interaction.withRequest.path.toString()
  const body = interaction.given[given].body
  const statusCode = interaction.given[given].status
  cy.intercept(method, url, { body: parseLikeObject(body), statusCode }).as(alias)
}