/// <reference types="cypress" />
import { Interactions, methods } from './interactionTypes'
import { getUrl } from './commonInteractions'

export interface Cy {
  intercept(method: methods, url: string, response?: any): any

  wait(name: string): any
}

export class InterceptInteractionsStore {
  constructor(private interactions: Interactions) {
    for (const key of Object.keys(interactions)) {
      this.selected[key] = { given: Object.keys(interactions[key].given)[0] }
    }
  }

  private selected: { [index: string]: { given: string; delay?: number } } = {}

  public getValue(key: string) {
    const selectedGiven = this.selected[key].given
    const value = this.interactions[key]?.given[selectedGiven]
    return { statusCode: value?.status, body: value?.body, headers: value?.headers }
  }

  public setGiven(key: string, given: string) {
    this.selected[key] = { given }
  }

  public setDelay(key: string, delay: number) {
    this.selected[key].delay = delay
  }

  public getDelay(key: string) {
    return this.selected[key].delay
  }
}

export const interceptInteractions = (interactions: Interactions, options?: { host?: string }) => {
  const store = new InterceptInteractionsStore(interactions)
  for (const key of Object.keys(interactions)) {
    const interaction = interactions[key]
    const method = interaction.withRequest.method
    let url = getUrl(options?.host, interaction)
    cy.intercept(method, url, async (req) => {
      if (store.getDelay(key)) await new Promise((resolve) => setTimeout(resolve, store.getDelay(key)))
      if (interaction.transitions)
        for (const transitionKey of Object.keys(interaction.transitions))
          store.setGiven(transitionKey, interaction.transitions[transitionKey])
      req.reply(store.getValue(key))
    }).as(key)
  }
  return store
}
