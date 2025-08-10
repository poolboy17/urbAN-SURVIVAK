
describe('Blog E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads the homepage successfully', () => {
    cy.get('h1').should('be.visible')
    cy.get('main').should('exist')
  })

  it('displays blog posts', () => {
    cy.get('[data-cy=post-link]').should('have.length.at.least', 1)
  })

  it('navigates to a blog post', () => {
    cy.get('[data-cy=post-link]').first().click()
    cy.url().should('include', '/posts/')
    cy.get('h1').should('be.visible')
  })

  it('navigates back to home from post', () => {
    cy.get('[data-cy=post-link]').first().click()
    cy.get('[data-cy=back-to-home]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('has accessible navigation', () => {
    cy.get('nav').should('exist')
    cy.get('header').should('exist')
    cy.get('footer').should('exist')
  })

  it('is responsive on mobile', () => {
    cy.viewport('iphone-6')
    cy.get('main').should('be.visible')
    cy.get('h1').should('be.visible')
  })

  it('has proper SEO meta tags', () => {
    cy.get('head title').should('exist')
    cy.get('head meta[name="description"]').should('exist')
    cy.get('head meta[name="viewport"]').should('exist')
  })

  it('loads all images successfully', () => {
    cy.get('img').each(($img) => {
      cy.wrap($img).should('be.visible')
    })
  })

  it('has working internal links', () => {
    cy.get('a[href^="/"]').each(($link) => {
      const href = $link.attr('href')
      if (href && href !== '/') {
        cy.request(href).its('status').should('eq', 200)
      }
    })
  })

  it('validates form inputs if any exist', () => {
    cy.get('form').then(($forms) => {
      if ($forms.length > 0) {
        cy.get('input[required]').each(($input) => {
          cy.wrap($input).should('have.attr', 'required')
        })
      }
    })
  })
})

describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.injectAxe()
  })

  it('has no accessibility violations on homepage', () => {
    cy.checkA11y()
  })

  it('has no accessibility violations on post pages', () => {
    cy.get('[data-cy=post-link]').first().click()
    cy.checkA11y()
  })

  it('supports keyboard navigation', () => {
    cy.get('body').tab()
    cy.focused().should('be.visible')
  })

  it('has proper heading hierarchy', () => {
    cy.get('h1').should('have.length', 1)
    cy.get('h1, h2, h3, h4, h5, h6').each(($heading, index, $headings) => {
      if (index > 0) {
        const currentLevel = parseInt($heading.prop('tagName').slice(1))
        const prevLevel = parseInt($headings.eq(index - 1).prop('tagName').slice(1))
        expect(currentLevel).to.be.at.most(prevLevel + 1)
      }
    })
  })
})

describe('Performance Tests', () => {
  it('loads within acceptable time', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.performance.mark('start')
      },
      onLoad: (win) => {
        win.performance.mark('end')
        win.performance.measure('pageLoad', 'start', 'end')
        const measure = win.performance.getEntriesByName('pageLoad')[0]
        expect(measure.duration).to.be.lessThan(3000)
      }
    })
  })

  it('has optimized images', () => {
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt')
      cy.wrap($img).should('have.attr', 'loading')
    })
  })
})
