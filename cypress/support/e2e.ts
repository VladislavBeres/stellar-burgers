import './commands';

beforeEach(() => {
  //mock API запросов
  cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
    fixture: 'ingredients.json'
  }).as('getIngredients');

  cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
    success: true,
    name: 'Space бургер',
    order: {
      number: 12345
    }
  }).as('createOrder');
});
