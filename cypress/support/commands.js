
// Custom commands for blog testing

Cypress.Commands.add('generateArticle', (prompt) => {
  cy.visit('/generate');
  cy.get('textarea[name="prompt"]').type(prompt);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('checkSEOTags', () => {
  cy.get('head title').should('exist').and('not.be.empty');
  cy.get('head meta[name="description"]').should('exist').and('have.attr', 'content');
});

Cypress.Commands.add('waitForHydration', () => {
  cy.get('[data-reactroot]').should('exist');
});
