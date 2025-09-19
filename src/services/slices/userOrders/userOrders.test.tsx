import {
  getUserOrders,
  getUserOrderByNumber,
  userOrdersSlice,
  initialState,
  userOrdersList,
  userOrdersByNumber
} from './userOrders';
import { TOrder } from '@utils-types';
import { expect } from '@jest/globals';

//моки для API функций
jest.mock('@api', () => ({
  getOrdersApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

//Массив заказов\\
const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'created',
    name: 'Тестовый заказ 1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 1
  },
  {
    _id: '2',
    ingredients: ['ingredient3', 'ingredient4'],
    status: 'done',
    name: 'Тестовый заказ 2',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    number: 2
  }
];

//ответ API при получении списка заказов
const mockOrdersResponse = mockOrders;

//ответ API при получении заказа по номеру
const mockOrderByNumberResponse = {
  orders: [mockOrders[0]],
  success: true
};

//тестовая ошибка
const mockError = new Error('Ошибка получения заказов');

describe('user orders slice', () => {
  //очистка моков перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //тест начального состояния\\
  describe('initial state', () => {
    test('должен возвращать исходное состояние с пустыми заказами и загрузкой false', () => {
      const state = userOrdersSlice.reducer(undefined, { type: '' });

      //проверка, что состояние соответствует начальному состоянию
      expect(state).toEqual(initialState);
    });
  });

  //тест начала действий - pending\\
  describe('pending actions', () => {
    test('следует установить состояние загрузки в true для любого ожидающего действия', () => {
      //массив действий в состоянии "pending" (начало выполнения)
      const actions = [
        getUserOrders.pending('request-id', undefined),
        getUserOrderByNumber.pending('request-id', 1)
      ];

      actions.forEach((action) => {
        //создание предыдущего состояния с выключенной загрузкой
        const previousState = {
          ...initialState,
          isLoading: false
        };

        const state = userOrdersSlice.reducer(previousState, action);

        //проверка итогов: загрузка включилась, список не изменился
        expect(state.isLoading).toBe(true);
        expect(state.orders).toEqual([]);
      });
    });
  });

  //тест успешных операций - fulfilled\\
  describe('fulfilled actions', () => {
    test('следует установить данные о заказах и завершить загрузку для getUserOrders', () => {
      //создание действия успешного получения списка заказов
      const action = getUserOrders.fulfilled(
        mockOrdersResponse,
        'request-id',
        undefined
      );

      //предыдущее состояние с включенной загрузкой
      const previousState = {
        orders: [],
        isLoading: true
      };

      const state = userOrdersSlice.reducer(previousState, action);

      //проверка итогов: список заказов установился корректно загрузка выключилась
      expect(state.orders).toEqual(mockOrders);
      expect(state.isLoading).toBe(false);
    });

    //тест: получение заказа по номеру
    test('следует установить данные заказов и завершить загрузку для getUserOrderByNumber', () => {
      //создание действия
      const action = getUserOrderByNumber.fulfilled(
        mockOrderByNumberResponse,
        'request-id',
        1
      );

      //предыдущее состояние с включенной загрузкой
      const previousState = {
        orders: [],
        isLoading: true
      };

      const state = userOrdersSlice.reducer(previousState, action);

      //проверка итогов: установился корректный заказ, загрузка выключилась
      expect(state.orders).toEqual([mockOrders[0]]);
      expect(state.isLoading).toBe(false);
    });
  });

  //Тест ошибок операций - rejected\\
  describe('rejected actions', () => {
    test('следует завершить загрузку и сохранить заказы без изменений для любого отклоненного действия', () => {
      const actions = [
        getUserOrders.rejected(mockError, 'request-id', undefined),
        getUserOrderByNumber.rejected(mockError, 'request-id', 1)
      ];

      actions.forEach((action) => {
        //предыдущее состояние с включенной загрузкой и тестовыми заказами
        const previousState = {
          orders: mockOrders,
          isLoading: true
        };

        const state = userOrdersSlice.reducer(previousState, action);

        //проверка итогов: загрузка выключилась, список остался неименным
        expect(state.isLoading).toBe(false);
        expect(state.orders).toEqual(mockOrders);
      });
    });
  });

  //Тесты селекторов\\
  describe('user orders selectors', () => {
    //тестовое состояние всего store
    const testState = {
      userOrders: {
        orders: mockOrders,
        isLoading: false
      }
    };

    //получение списка заказов
    test('userOrdersList должен возвращать список заказов', () => {
      const result = userOrdersList(testState);
      expect(result).toEqual(mockOrders);
      expect(result.length).toBe(2);
    });

    //получение списка заказов по номеру
    test('userOrdersByNumber должен возвращать список заказов', () => {
      const result = userOrdersByNumber(testState);
      expect(result).toEqual(mockOrders);
      expect(result.length).toBe(2);
    });
  });
});
