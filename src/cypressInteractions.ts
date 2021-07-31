import { getUrl, parseLikeObject } from './commonInteractions'
import { CreateInteractions, methods } from './interactionTypes'

export interface Cy {
  intercept(method: methods, url: string, response?: any): any,

  wait(name: string): any
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
  cy.intercept(method, url, { body: parseLikeObject(body), statusCode, delay: options?.delay }).as(alias)
}

export const waitTransition = (
  cy: Cy,
  alias: string,
  createInteractions: CreateInteractions) => {
  cy.wait(`@${alias}`)
  const interactions = createInteractions(v => v)
  const transitions = interactions[alias].transitions
  if (transitions) {
    for (const key of Object.keys(transitions)) {
      interceptInteraction(cy, key, transitions[key], createInteractions)
    }
  }
}
