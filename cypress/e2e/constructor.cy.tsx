import '../support/commands';

describe('Тестирование конструктора бургеров', () => {
  beforeEach(() => {
    // Переход на главную страницу приложения
    cy.visit('http://localhost:4000');
    // Ожидание завершения загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  // --- Тест 1: Проверка добавления ингредиентов в конструктор ---
  it('Проверка корректного добавления ингредиентов в конструктор', () => {
    // Добавление булки в конструктор
    cy.addIngredientToConstructor('Краторная булка N-200i');
    // Проверка появления булки в конструкторе
    cy.get('[data-testid=constructor-bun]').should(
      'contain',
      'Краторная булка N-200i'
    );

    // Добавление основного ингредиента (котлеты)
    cy.addIngredientToConstructor('Биокотлета из марсианской Магнолии');
    // Проверка появления котлеты в конструкторе
    cy.get('[data-testid=constructor-ingredients]').should(
      'contain',
      'Биокотлета'
    );

    // Добавление соуса в конструктор
    cy.addIngredientToConstructor('Соус Spicy-X');
    // Проверка появления соуса в конструкторе
    cy.get('[data-testid=constructor-ingredients]').should(
      'contain',
      'Соус Spicy-X'
    );
  });

  // --- Тест 2: Проверка работы модальных окон ингредиентов ---
  it('Проверка открытия и закрытия модального окна ингредиента', () => {
    // Открытие модального окна при клике на ингредиент
    cy.contains('Краторная булка N-200i').click();

    // Проверка корректного отображения модального окна
    cy.get('[data-testid=modal]').should('be.visible');
    cy.get('[data-testid=modal]').should('contain', 'Краторная булка N-200i');

    // Закрытие модального окна через кнопку закрытия
    cy.closeModal();

    // Повторное открытие модального окна
    cy.contains('Краторная булка N-200i').click();

    // Закрытие модального окна через оверлей
    cy.get('[data-testid=modal-overlay]').click({ force: true });
    // Проверка корректного закрытия модального окна
    cy.get('[data-testid=modal]').should('not.exist');
  });

  // --- Тест 3: Полный сценарий создания заказа ---
  it('Проверка полного цикла создания заказа', () => {
    // Переход на страницу авторизации
    cy.visit('http://localhost:4000/login');

    // Выполнение авторизации пользователя
    cy.login('test@example.com', 'password');

    // Возврат на главную страницу
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');

    // Добавление ингредиентов в конструктор
    cy.addIngredientToConstructor('Краторная булка N-200i');
    cy.addIngredientToConstructor('Биокотлета из марсианской Магнолии');
    cy.addIngredientToConstructor('Соус Spicy-X');

    // Оформление заказа
    cy.createOrder();

    // Проверка отображения номера заказа в модальном окне
    cy.get('[data-testid=modal]').should('be.visible');
    cy.get('[data-testid=order-number]').should('contain', '12345');

    // Закрытие модального окна с номером заказа
    cy.closeModal();

    // Проверка очистки конструктора после создания заказа
    cy.get('[data-testid=constructor-bun]').should('not.exist');
    cy.get('[data-testid=constructor-ingredients')
      .should('not.contain', 'Биокотлета из марсианской Магнолии')
      .and('not.contain', 'Соус Spicy-X');
  });
});
