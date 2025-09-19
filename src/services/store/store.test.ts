import store, { rootReducer, RootState } from './store';
import { expect } from '@jest/globals';

// импортируем редьюсеры каждого слайса
import { constructorSlice } from '../slices/constructor/constructor';
import { ingredientsSlise } from '../slices/ingredients/ingredients';
import { feedsSlice } from '../slices/feed/feed';
import { userSlice } from '../slices/user/user';
import { userOrdersSlice } from '../slices/userOrders/userOrders';
import { createOrderSlice } from '../slices/newOrder/newOrder';

describe('rootReducer', () => {
  test('следует правильно инициализировать с помощью комбинированных редукторов', () => {
    // проверка, что стор создан
    expect(store).toBeDefined();

    // создаём "левое" действие
    const fakeAction = { type: 'UNKNOWN_ACTION' };

    // инициализация rootReducer
    const state = rootReducer(undefined, fakeAction) as RootState;

    // проверяем, что начальное состояние совпадает с состоянием редьюсеров
    expect(state).toEqual({
      constructorIngredient: constructorSlice.reducer(undefined, fakeAction),
      ingredients: ingredientsSlise.reducer(undefined, fakeAction),
      feeds: feedsSlice.reducer(undefined, fakeAction),
      user: userSlice.reducer(undefined, fakeAction),
      userOrders: userOrdersSlice.reducer(undefined, fakeAction),
      newOrder: createOrderSlice.reducer(undefined, fakeAction)
    });
  });
});
