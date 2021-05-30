import { getUrl, parseLikeObject } from './commonInteractions'
import { CreateInteractions, methods } from './interactionTypes'

export interface Cy {
  intercept(method: methods, url: string, response?: any): any
}

export const interceptInteraction = (
  cy: Cy,
  alias: string,
  given: string,
  createInteractions: CreateInteractions,
  options?: { host?: string; delay: number }
) => {
  const interaction = (createInteractions((v) => v) as any)[alias]
  const method = interaction.withRequest.method
  let url = getUrl(options?.host, interaction)
  const body = interaction.given[given].body
  const statusCode = interaction.given[given].status
  cy.intercept(method, url, { body: parseLikeObject(body), statusCode, delay: options?.delay }).as(alias)
}
