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
  const result = await fetch("/api/successfail",{method: "PUT"})
  document.getElementById("status").innerHTML=result.status.toString()
}
async function transition(){
  await fetch("/api/transition",{method: "POST"})
}
</script>
<body>
<div id='status'></div>
<button onclick='transition()'>Transition</button>
<button onclick='updateValue()'>Update</button>
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
    const interactionSelector = interceptInteractions(createTestInteractions())
    cy.visit('/')
    interactionSelector['successFailInteraction'] = 'fail'
    cy.get('button:contains(Update)').click()
    cy.get('div:contains(401)').should('exist')
  })

  it.only('Transition', () => {
    interceptInteractions(createTestInteractions())
    cy.visit('/')
    cy.get('button:contains(Update)').click()
    cy.get('div:contains(200)').should('exist')
    cy.get('button:contains(Transition)').click()
    cy.get('button:contains(Update)').click()
    cy.get('div:contains(401)').should('exist')
  })
})
