/// <reference types="cypress" />

import { prepareIntercepts, waitTransition } from '../../src/cypressInteractions'
import { createTestInteractions } from '../../test/testInteractions'

describe('Transitions', () => {
  it('Should transition to next state', () => {
    prepareIntercepts(cy, createTestInteractions)
    cy.intercept('GET', '/', `
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

</html>`)
    cy.visit('/')
    cy.get('button:contains(Update)').click()
    cy.get("div:contains(200)").should("exist")
    cy.get('button:contains(Transition)').click()
    waitTransition(cy, 'transitionInteraction', createTestInteractions)
    cy.get('button:contains(Update)').click()
    cy.get("div:contains(401)").should("exist")
  })
})
