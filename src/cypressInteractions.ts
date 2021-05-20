import { getUrl, InteractionContent, parseLikeObject } from './commonInteractions'
import { CreateInteractions, methods } from './interactionTypes'

export interface Cy {
  intercept(method: methods, url: string, response?: any): any
}

export const interceptInteraction = (
  cy: Cy,
  alias: string,
  given: string,
  createInteractions: CreateInteractions,
  host?: string
) => {
  const interaction = (createInteractions((v) => v) as any)[alias]
  const method = interaction.withRequest.method
  let url = getUrl(host, interaction)
  const body = interaction.given[given].body
  const statusCode = interaction.given[given].status
  cy.intercept(method, url, { body: parseLikeObject(body), statusCode }).as(alias)
}
