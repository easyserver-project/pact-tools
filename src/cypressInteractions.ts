import { getUrl, parseLikeObject } from './commonInteractions'
import { CreateInteractions, methods } from './interactionTypes'

export interface Cy {
  intercept(method: methods, url: string, response?: any): any
}

export const prepareIntercepts = (
  cy: Cy,
  createInteractions: CreateInteractions,
  options?: { host?: string; delay: number }) => {
  const interactions = createInteractions((v) => v)
  for (const key of Object.keys(interactions)) {
    const interaction = interactions[key]
    const firstGiven = Object.keys(interaction.given)[0]
    interceptInteraction(cy, key, firstGiven, createInteractions, options)
  }
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
  if (interaction.given[given].transitions)
    cy.intercept(method, url, (req: any) => {
      req.reply({
        body: parseLikeObject(body),
        statusCode,
        delay: options?.delay
      })
      for (const transition of Object.keys(interaction.given[given].transitions)) {
        interceptInteraction(cy, transition, interaction.given[given].transitions[transition], createInteractions, options)
      }
    }).as(alias)
  else
    cy.intercept(method, url, { body: parseLikeObject(body), statusCode, delay: options?.delay }).as(alias)

}
