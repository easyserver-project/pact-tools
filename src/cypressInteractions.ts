import { parseLikeObject } from './commonInteractions'
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
  let url = (host || '') + interaction.withRequest.path.toString()
  for (const key of Object.keys(interaction.withRequest.pathParams)) {
    if (!interaction.withRequest.path.includes(`:${key}`))
      throw `:${key} not found in url '${interaction.withRequest.path}'`
    url = url.replace(`:${key}`, '*')
  }
  const body = interaction.given[given].body
  const statusCode = interaction.given[given].status
  cy.intercept(method, url, { body: parseLikeObject(body), statusCode }).as(alias)
}
