import store, { RootState } from './store';
import { expect } from '@jest/globals';

describe('rootReducer', () => {
  test('следует правильно инициализировать с помощью комбинированных редукторов', () => {
    //проверка, что стор создан
    expect(store).toBeDefined();

    //получение состояния rootReducer
    const state = store.getState() as RootState;

    //проверка, что все слайсы существуют в rootReducer
    expect(state.constructorIngredient).toBeDefined();
    expect(state.ingredients).toBeDefined();
    expect(state.feeds).toBeDefined();
    expect(state.user).toBeDefined();
    expect(state.newOrder).toBeDefined();
  });
});
