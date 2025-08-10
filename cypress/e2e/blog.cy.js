
describe('Blog Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays blog homepage correctly', () => {
    cy.contains('h1').should('be.visible');
    cy.get('[data-cy="post-list"]').should('exist');
  });

  it('navigates to individual blog posts', () => {
    cy.get('a[href*="/posts/"]').first().click();
    cy.url().should('include', '/posts/');
    cy.get('article').should('be.visible');
  });

  it('navigates to article generator', () => {
    cy.contains('Generate Article').click();
    cy.url().should('include', '/generate');
    cy.get('form').should('be.visible');
    cy.get('textarea[name="prompt"]').should('be.visible');
  });

  it('can interact with article generator form', () => {
    cy.visit('/generate');
    cy.get('textarea[name="prompt"]').type('Test article about technology');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('has proper SEO meta tags', () => {
    cy.get('head title').should('exist');
    cy.get('head meta[name="description"]').should('exist');
    cy.get('head meta[property="og:title"]').should('exist');
  });
});
