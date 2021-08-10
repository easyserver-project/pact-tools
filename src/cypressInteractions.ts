/// <reference types="cypress" />
import { Interactions, methods } from './interactionTypes'
import { getUrl } from './commonInteractions'

export interface Cy {
  intercept(method: methods, url: string, response?: any): any

  wait(name: string): any
}

export const interceptInteractions = (interactions: Interactions, options?: { host?: string; delay: number }) => {
  const selected: { [index: string]: string } = {}
  for (const key of Object.keys(interactions)) {
    const interaction = interactions[key]
    const given = Object.keys(interaction.given)
    if (given.length === 0) continue
    selected[key] = given[0]
    const method = interaction.withRequest.method
    let url = getUrl(options?.host, interaction)
    cy.intercept(url, (req) => {
      if (interaction.transitions) {
        for (const transitionKey of Object.keys(interaction.transitions)) {
          selected[transitionKey] = interaction.transitions[transitionKey]
        }
      }
      req.reply({
        statusCode: interaction.given[selected[key]].status,
        body: interaction.given[selected[key]].body,
        headers: interaction.given[selected[key]].headers,
      })
    })
  }
  return selected
}
