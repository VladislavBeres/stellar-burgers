import { addItem, constructorSlice, initialState } from './constructor';
import { TConstructorIngredient } from '@utils-types';
import { expect } from '@jest/globals';

describe('constructor slice', () => {
  //тестовые данные ингредиентов
  //булка
  const testBun: TConstructorIngredient = {
    id: '643d69a5c3f7b9001cfa093c',
    _id: '643d69a5c3f7b9001cfa093c',
    type: 'bun',
    name: 'Краторная булка N-200i',
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    calories: 420,
    proteins: 80,
    fat: 24,
    carbohydrates: 53
  };

  //котлетка
  const testMainIngredient: TConstructorIngredient = {
    id: '643d69a5c3f7b9001cfa0941',
    _id: '643d69a5c3f7b9001cfa0941',
    type: 'main',
    name: 'Биокотлета из марсианской Магнолии',
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    calories: 4242,
    proteins: 420,
    fat: 142,
    carbohydrates: 242
  };

  //соус
  const testSauceIngredient: TConstructorIngredient = {
    id: '643d69a5c3f7b9001cfa0942',
    _id: '643d69a5c3f7b9001cfa0942',
    type: 'sauce',
    name: 'Coyc Spicy-X',
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    calories: 30,
    proteins: 30,
    fat: 20,
    carbohydrates: 40
  };

  //тест: добавление ингредиента\\\
  describe('addItem action', () => {
    //тест: добавление булки
    test('следует добавить булочку с правильными данными', () => {
      const state = constructorSlice.reducer(
        initialState,
        constructorSlice.actions.addItem(testBun)
      );

      //проверка, что булка добавилась
      expect(state.bun).toEqual(testBun);

      //проверка, что это именно та булка
      expect(state.bun?.name).toBe('Краторная булка N-200i');
      expect(state.bun?.price).toBe(1255);
      expect(state.bun?.type).toBe('bun');

      //проверка, что ингредиенты пустые
      expect(state.ingredients).toEqual([]);
    });

    //тест: добавление котлеты
    test('следует добавить основной ингредиент к набору ингредиентов', () => {
      const state = constructorSlice.reducer(
        initialState,
        constructorSlice.actions.addItem(testMainIngredient)
      );

      //проверка, что булки нет
      expect(state.bun).toBeNull();

      //проверка, что булка добавилась
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(testMainIngredient);
      expect(state.ingredients[0]?.name).toBe(
        'Биокотлета из марсианской Магнолии'
      );
      expect(state.ingredients[0]?.price).toBe(424);
    });

    //тест: добавление соуса
    test('следует добавить ингредиент для соуса к набору ингредиентов', () => {
      const state = constructorSlice.reducer(
        initialState,
        constructorSlice.actions.addItem(testSauceIngredient)
      );

      //проверка, что булки нет
      expect(state.bun).toBeNull();

      //проверка, что соус добавлен
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(testSauceIngredient);
      expect(state.ingredients[0]?.name).toBe('Coyc Spicy-X');
      expect(state.ingredients[0]?.price).toBe(90);
      expect(state.ingredients[0]?.type).toBe('sauce');
    });
  });

  //тест: удаление ингредиента\\
  describe('deleteItem action', () => {
    //тест: удаление котлеты
    test('следует удалить основной ингредиент', () => {
      //добавление котлеты
      let state = constructorSlice.reducer(
        initialState,
        constructorSlice.actions.addItem(testMainIngredient)
      );

      //добавление соуса
      state = constructorSlice.reducer(
        state,
        constructorSlice.actions.addItem(testSauceIngredient)
      );

      //удаление котлеты
      const stateAfterDelete = constructorSlice.reducer(
        state,
        constructorSlice.actions.deleteItem(testMainIngredient)
      );

      //проверка, что остался только соус
      expect(stateAfterDelete.ingredients).toHaveLength(1);
      expect(stateAfterDelete.ingredients[0]._id).toBe(
        '643d69a5c3f7b9001cfa0942'
      );
      expect(stateAfterDelete.ingredients[0].name).toBe('Coyc Spicy-X');
    });

    //тест: удаление соуса\\
    test('следует удалить ингредиент соуса', () => {
      //добавление соуса
      let state = constructorSlice.reducer(
        initialState,
        constructorSlice.actions.addItem(testSauceIngredient)
      );

      //добавление котлеты
      state = constructorSlice.reducer(
        state,
        constructorSlice.actions.addItem(testMainIngredient)
      );

      //удаление соуса
      const stateAfterDelete = constructorSlice.reducer(
        state,
        constructorSlice.actions.deleteItem(testSauceIngredient)
      );

      //проверка, что осталась только котлета
      expect(stateAfterDelete.ingredients).toHaveLength(1);
      expect(stateAfterDelete.ingredients[0]._id).toBe(
        '643d69a5c3f7b9001cfa0941'
      );
      expect(stateAfterDelete.ingredients[0].name).toBe(
        'Биокотлета из марсианской Магнолии'
      );
    });
  });

  //тест: изменение порядка ингредиентов\\
  describe('updateAll action', () => {
    test('следует правильно расположить ингредиенты', () => {
      //добавление котлеты
      let state = constructorSlice.reducer(
        initialState,
        constructorSlice.actions.addItem(testMainIngredient)
      );

      //добавление соуса
      state = constructorSlice.reducer(
        state,
        constructorSlice.actions.addItem(testSauceIngredient)
      );

      //смена порядка (соус первый, котлета вторая)
      const reorderedIngredients = [testSauceIngredient, testMainIngredient];
      state = constructorSlice.reducer(
        state,
        constructorSlice.actions.updateAll(reorderedIngredients)
      );

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]._id).toBe('643d69a5c3f7b9001cfa0942');
      expect(state.ingredients[0].name).toBe('Coyc Spicy-X');
      expect(state.ingredients[1]._id).toBe('643d69a5c3f7b9001cfa0941');
      expect(state.ingredients[1].name).toBe(
        'Биокотлета из марсианской Магнолии'
      );
    });
  });

  //тест: очиста\\
  describe('clearAll action', () => {
    test('следует очистить все ингредиенты, включая булочку', () => {
      //добавление булки
      let state = constructorSlice.reducer(
        initialState,
        constructorSlice.actions.addItem(testBun)
      );

      //добавление котлеты
      state = constructorSlice.reducer(
        state,
        constructorSlice.actions.addItem(testMainIngredient)
      );

      //добавление соуса
      state = constructorSlice.reducer(
        state,
        constructorSlice.actions.addItem(testSauceIngredient)
      );

      //очистка
      state = constructorSlice.reducer(
        state,
        constructorSlice.actions.clearAll()
      );

      //проверка, что всё очистилось
      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
      expect(state).toEqual(initialState);
    });
  });

  //тест: замена булки в конструкторе\\
  describe('replacing bun', () => {
    test('следует заменить существующую булочку', () => {
      const anotherBun: TConstructorIngredient = {
        id: '643d69a5c3f7b9001cfa093d',
        _id: '643d69a5c3f7b9001cfa093d',
        type: 'bun',
        name: 'Флюоресцентная булка R2-D3',
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
        calories: 643,
        proteins: 44,
        fat: 26,
        carbohydrates: 85
      };

      let state = constructorSlice.reducer(initialState, addItem(testBun));
      state = constructorSlice.reducer(state, addItem(anotherBun));

      expect(state.bun?._id).toBe('643d69a5c3f7b9001cfa093d');
      expect(state.bun?.name).toBe('Флюоресцентная булка R2-D3');
    });
  });

  //тест: добавление одинаковых ингредиентов\\
  describe('add sample ingredients', () => {
    test('следует использовать несколько одинаковых ингредиентов', () => {
      let state = constructorSlice.reducer(
        initialState,
        addItem(testMainIngredient)
      );
      state = constructorSlice.reducer(state, addItem(testMainIngredient));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]._id).toBe(testMainIngredient._id);
      expect(state.ingredients[1]._id).toBe(testMainIngredient._id);
    });
  });
});
