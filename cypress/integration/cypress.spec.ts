/// <reference types="cypress" />

import { interceptInteractions } from '../../src/cypressInteractions'
import { createTestInteractions } from '../../test/testInteractions'

describe('Transitions', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/',
      `
<html lang='en'>
<head><title>Demo</title></head>
<script>
async function updateValue(){
  document.getElementById("status").innerHTML="Loading"
  const result = await fetch("/api/successfail",{method: "PUT"})
  document.getElementById("status").innerHTML=result.status.toString()
}
async function transition(){
  await fetch("/api/transition",{method: "POST"})
}
async function fetchWithQuery(){
  const result = await fetch("/api/query?id=someid",{method: "POST"})
  document.getElementById("status").innerHTML=result.status.toString()
}
async function fetchWithPath(){
  const result = await fetch("/api/name/Adam/Adamsson",{method: "GET"})
  document.getElementById("status").innerHTML=result.status.toString()
}
</script>
<body>
<div id='status'></div>
<button onclick='transition()'>Transition</button>
<button onclick='updateValue()'>Update</button>
<button onclick='fetchWithQuery()'>Query</button>
<button onclick='fetchWithPath()'>Path</button>
</body>

</html>`
    )
  })

  it('Default Intercept', () => {
    interceptInteractions(createTestInteractions())
    cy.visit('/')
    cy.get('button:contains(Update)').click()
    cy.get('div:contains(200)').should('exist')
  })

  it('Change response', () => {
    const interactionsStore = interceptInteractions(createTestInteractions())
    cy.visit('/')
    interactionsStore.setGiven('successFailInteraction', 'fail')
    cy.get('button:contains(Update)').click()
    cy.get('div:contains(401)').should('exist')
  })

  it('Transition', () => {
    interceptInteractions(createTestInteractions())
    cy.visit('/')
    cy.get('button:contains(Update)').click()
    cy.get('div:contains(200)').should('exist')
    cy.get('button:contains(Transition)').click()
    cy.get('button:contains(Update)').click()
    cy.get('div:contains(401)').should('exist')
  })

  it('Query parameter', () => {
    interceptInteractions(createTestInteractions())
    cy.visit('/')
    cy.get('button:contains(Query)').click()
    cy.get('div:contains(200)').should('exist')
  })

  it('Path parameter', () => {
    interceptInteractions(createTestInteractions())
    cy.visit('/')
    cy.get('button:contains(Path)').click()
    cy.get('div:contains(200)').should('exist')
  })

  it('Should be called', () => {
    interceptInteractions(createTestInteractions())
    cy.visit('/')
    cy.get('button:contains(Update)').click()
    cy.wait('@successFailInteraction')
  })

  it('Delay', () => {
    const store = interceptInteractions(createTestInteractions())
    cy.visit('/')
    store.setDelay("successFailInteraction",500)
    cy.get('button:contains(Update)').click()
    cy.get('div:contains(Loading)').should('exist')
    cy.get('div:contains(200)').should('exist')
  })
})
