
// Custom commands for testing

Cypress.Commands.add('getByDataCy', (selector) => {
  return cy.get(`[data-cy=${selector}]`)
})

Cypress.Commands.add('loginByAPI', (username, password) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      username: username,
      password: password,
    },
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.token)
  })
})

Cypress.Commands.add('checkLinkAccessibility', () => {
  cy.get('a').each(($link) => {
    cy.wrap($link).should('have.attr', 'href')
    cy.wrap($link).should('not.have.attr', 'href', '#')
  })
})

Cypress.Commands.add('validatePageLoad', () => {
  cy.get('body').should('be.visible')
  cy.get('main').should('exist')
  cy.title().should('not.be.empty')
})

// Custom command for testing responsive design
Cypress.Commands.add('testResponsive', (selector) => {
  const sizes = ['iphone-6', 'ipad-2', [1024, 768]]
  
  sizes.forEach((size) => {
    cy.viewport(size)
    cy.get(selector).should('be.visible')
  })
})
