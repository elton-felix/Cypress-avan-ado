
describe('Hacker Stories', () => {
  const initialTerm = 'React'
  const newTerm = 'Cypress'

  context('Hitting the real API', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: initialTerm,
          page: '0'
        }
      }).as('getStories')

      cy.visit('/')

      cy.wait('@getStories')
    })

    it('shows 20 stories, then the next 20 after clicking "More"', () => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: initialTerm,
          page: '1'
        }
      }).as('getNextStories')

      cy.get('.item').should('have.length', 20)

      cy.contains('More')
      .should('be.visible')
      .click()

      cy.wait('@getNextStories')

      // cy.assertLoadingIsShownAndHidden()

      cy.get('.item').should('have.length', 40)
    })

    it('searches via the last searched term', () => {
      cy.intercept(
        'GET',
          `**/search?query=${newTerm}&page=0`
      ).as('getNewTermStories')

      cy.get('#search')
        .should('be.visible')
        .clear()
        .type(`${newTerm}{enter}`)

      cy.wait('@getNewTermStories')
      // cy.assertLoadingIsShownAndHidden()

      cy.getLocalStorage('search')
      .should('be.equal', newTerm)

      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
        .click()

      cy.wait('@getStories')
      // cy.assertLoadingIsShownAndHidden()

      cy.getLocalStorage('search')
      .should('be.equal', initialTerm)

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('be.visible')
        .and('contain', initialTerm)
      cy.get(`button:contains(${newTerm})`)
        .should('be.visible')
    })
  })

  context('Mocking the API', () => {
    context('Footer and list of stories', () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
             `**search?query=${initialTerm}&page=0`,
             { fixture: 'stories' }

        ).as('getStories')

        cy.visit('/')

        cy.wait('@getStories')
      })

      it('shows the footer', () => {
        cy.get('footer')
          .should('be.visible')
          .and('contain', 'Icons made by Freepik from www.flaticon.com')
      })

      context('List of stories', () => {
        const stories = require('../fixtures/stories')
        it('shows the right data for all rendered stories', () => {
          

          cy.get('.item')
          .first()// pegando o primeiro elemento
          .should('be.visible')
          .should('contain', stories.hits[0].title)//verificando se o titulo do elemento ?? igual ao do primeiro elemento do hits
          .and('contain', stories.hits[0].author)
          .and('contain', stories.hits[0].num_comments)
          .and('contain', stories.hits[0].points)
          .and('contain', stories.hits[0].author)
          cy.get(`.item a:contains(${stories.hits[0].title})`)
          .should('have.attr', 'href', stories.hits[0].url)

          cy.get('.item')
          .last()//pegando o ultimo elemento
          .should('be.visible')
          .should('contain', stories.hits[1].title)
          .and('contain', stories.hits[1].author)
          .and('contain', stories.hits[1].num_comments)
          .and('contain', stories.hits[1].points)
          .and('contain', stories.hits[1].author)
          cy.get(`.item a:contains(${stories.hits[1].title})`)
          .should('have.attr', 'href', stories.hits[1].url)
        })

        it('shows one less story after dimissing the first one', () => {
          cy.get('.button-small')
            .should('be.visible')
            .first()
            .click()

          cy.get('.item').should('have.length', 1)
        })

        context('Order by', () => {
          it('orders by title', () => {
            cy.get('.list-header-button:contains(Title)')
            .as('titleHeader')
            .should('be.visible')
            .click()

            cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[0].title)
            cy.get(`.item a:contains(${stories.hits[0].title})`)
          .should('have.attr', 'href', stories.hits[0].url)

          cy.get('@titleHeader')
          .click()

          cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[1].title)
            cy.get(`.item a:contains(${stories.hits[1].title})`)
          .should('have.attr', 'href', stories.hits[1].url)
          })
            
          
          it('orders by author', () => {
            cy.get('.list-header-button:contains(Author)')
            .as('authorHeader')
            .should('be.visible')
            .click()

            cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[0].author)


          cy.get('@authorHeader')
          .click()

          cy.get('.item')
            .first()
            .should('be.visible')
          .and('contain', stories.hits[1].author)
          })

          it('orders by comments', () => {
            cy.get('.list-header-button:contains(Comments)')
            .as('commentsHeader')
            .should('be.visible')
            .click()

            cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[1].num_comments)
            
          cy.get('@commentsHeader')
          .click()

          cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[0].num_comments)
          
          })

          it('orders by points', () => {
            cy.get('.list-header-button:contains(Points)')
            .as('pointsHeader')
            .should('be.visible')
            .click()

            cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[1].points)
            
          cy.get('@pointsHeader')
          .click()

          cy.get('.item')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[0].points)
            
          })
        })
        
      })
    })
      

      // beforeEach(() => {

      //   // cy.intercept( forma anterior usando o intercept
      //   //   'GET',
      //   //   '**/search?query=React&page=0'
      //   // ).as('getStories')

      //   cy.intercept({//aguardar uma requisi????o acabar antes de seguir adiante/ utilizando agora o intercept com objeto
      //     method: 'GET',
      //     pathname: '**/search',
      //     query: {
      //       query: initialTerm,
      //       page: '0'
      //     }
      //   }).as('getStories')

      //   cy.visit('/')// o barro quer dizer que visitaremos a link que est?? definido no baseUrl

      //   cy.wait('@getStories')//espera a requisi????o

      //   //cy.assertLoadingIsShownAndHidden()
      //   //cy.contains('More').should('be.visible')
      // })

      context('Search', () => {
        beforeEach(() => {
          cy.intercept(//tras uma lista vazia
            'GET',
            `**/search?query=${initialTerm}&page=0`,
            { fixture: 'empty' }
          ).as('getEmptyStories')

          cy.intercept(//tras uma lista de historias
            'GET',
            `**/search?query=${newTerm}&page=0`,
            { fixture: 'stories' }
          ).as('getStories')

          cy.visit('/')

        cy.wait('@getEmptyStories')

          cy.get('#search')
          .should('be.visible')
            .clear()
        })

        it('shows no story when none is returned', () =>{
          cy.get('.item').should('not.exist')
        })

        it('types and hits ENTER', () => {
          cy.get('#search')
          .should('be.visible')
            .type(`${newTerm}{enter}`)

          cy.wait('@getStories')
          // cy.assertLoadingIsShownAndHidden()

          cy.getLocalStorage('search')
      .should('be.equal', newTerm)

          cy.get('.item').should('have.length', 2)
          cy.get(`button:contains(${initialTerm})`)
            .should('be.visible')
        })

        it('types and clicks the submit button', () => {
          cy.get('#search')
          .should('be.visible')
            .type(newTerm)
          cy.contains('Submit')
          .should('be.visible')
            .click()

          cy.wait('@getStories')
          // cy.assertLoadingIsShownAndHidden()

          cy.getLocalStorage('search')
           .should('be.equal', newTerm)

          cy.get('.item').should('have.length', 2)
          cy.get(`button:contains(${initialTerm})`)
            .should('be.visible')
        })

        //   //s?? apresentando uma alternativa diferente
        // it.only('types and submits the form directly', () => {
        //   cy.get('#search')
        //     .type(newTerm)
        //   cy.get('form').submit()// envia forms(n??o ?? uma forma que o usuario faria, pq o usuario necessitaria clicar no bot??o do form)

        //   cy.wait('@getNewTermStories')

        //   cy.get('.item').should('have.length', 20)

        //   // Assertion here
        // })

        context('Last searches', () => {
          it('shows a max of 5 buttons for the last searched terms', () => {
            const faker = require('faker')

            cy.intercept(
              'GET',
              '**/search**',
              { fixture: 'empty'}
            ).as('getRandomStories')

            Cypress._.times(6, () => { // definimos quantas vezes queremos executar determinados comandos
              const randomWord = faker.random.word()
              cy.get('#search')
                .clear()
                .type(`${randomWord}{enter}`)

              cy.wait('@getRandomStories')

              cy.getLocalStorage('search')
              .should('be.equal', randomWord)
            })

            // cy.assertLoadingIsShownAndHidden()

            // cy.get('.last-searches button')
            //   .should('have.length', 5)
            
            //o codigo abaixo tem a mesma fun????o do comentario acima, porem a abodagem do within pode ser boa para seletores grandes

            cy.get('.last-searches')
            .within(() => {
             cy.get('button').should('have.length', 5)
            })
          
          })
        })
      })
    })
  })

// Hrm, how would I simulate such errors?
// Since I still don't know, the tests are being skipped.
// TODO: Find a way to test them out.
context('Errors', () => {
  it('shows "Something went wrong ..." in case of a server error', () => {
    cy.intercept(
      'GET',
      '**/search**',
      { statusCode: 500 } // simulando erro no servidor
    ).as('getServerFailure')

    cy.visit('/')
    cy.wait('@getServerFailure')

    cy.get('p:contains(Something went wrong ...)').should('be.visible')
  })

  it('shows "Something went wrong ..." in case of a network error', () => {
    cy.intercept(
      'GET',
      '**/search**',
      { forceNetworkError: true } // simulando falha na rede
    ).as('getNetworkFailure')

    cy.visit('/')
    cy.wait('@getNetworkFailure')

    cy.get('p:contains(Something went wrong ...)').should('be.visible')
  })
})

it('shows a "Loading ..." state before showing the results', () => {
  
  cy.intercept(
    'GET',
    '**/search**',
    {
      delay: 1000, //simulando um atraso de 1 segundo para garantir que o loading fica visivel
      fixture: 'stories'
    }
  ).as('getDelayedStories')


  cy.visit('/')

  cy.assertLoadingIsShownAndHidden()
    cy.wait('@getDelayedStories')

  cy.get('.item').should('have.length', 2)
})

