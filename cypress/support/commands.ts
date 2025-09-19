export {};

// Расширение встроенных команд Cypress для добавления пользовательских методов
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      // Метод для авторизации пользователя
      login(email: string, password: string): Chainable<void>;

      // Метод для добавления ингредиента в конструктор бургера
      addIngredientToConstructor(ingredientName: string): Chainable<void>;

      // Метод для создания заказа
      createOrder(): Chainable<void>;

      // Метод для закрытия модального окна
      closeModal(): Chainable<void>;
    }
  }
}

// Пользовательская команда для авторизации в системе
Cypress.Commands.add('login', (email: string, password: string) => {
  // Мок запроса авторизации для имитации успешного входа
  cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', {
    statusCode: 200,
    body: {
      success: true,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: { email: 'test@example.com', name: 'Test User' }
    }
  }).as('loginRequest');

  // Мок запроса получения данных пользователя после авторизации
  cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
    statusCode: 200,
    body: {
      success: true,
      user: { email: 'test@example.com', name: 'Test User' }
    }
  }).as('getUser');

  // Заполнение полей формы авторизации
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);
  cy.get('button').contains('Войти').click();

  // Ожидание завершения запроса авторизации
  cy.wait('@loginRequest');

  // Проверка отсутствия преждевременного запроса данных пользователя
  cy.get('@getUser.all', { timeout: 1000 }).then((interceptions) => {
    if (interceptions.length === 0) {
      console.log(
        'Запрос получения данных пользователя не был выполнен, продолжаем тестирование...'
      );
    }
  });
});

// Пользовательская команда для добавления ингредиента
Cypress.Commands.add('addIngredientToConstructor', (ingredientName: string) => {
  // Поиск ингредиента по его названию
  cy.contains(ingredientName)
    // Переход к родительскому элементу (карточка ингредиента)
    .parents('li')
    .within(() => {
      // Поиск и нажатие кнопки добавления
      cy.get('button').contains('Добавить').click();
    });
});

// Пользовательская команда для создания заказа
Cypress.Commands.add('createOrder', () => {
  // Мок запроса создания заказа
  cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
    statusCode: 200,
    body: {
      success: true,
      name: 'Space burger',
      order: { number: 12345 }
    }
  }).as('createOrder');

  // Инициирование процесса создания заказа
  cy.get('button').contains('Оформить заказ').click();

  // Ожидание завершения запроса создания заказа
  cy.wait('@createOrder');
});

// Пользовательская команда для закрытия модального окна
Cypress.Commands.add('closeModal', () => {
  // Нажатие на кнопку закрытия модального окна
  cy.get('[data-testid=modal-close]').click();

  // Проверка корректного закрытия модального окна
  cy.get('[data-testid=modal]').should('not.exist');
});
