// import {
//   createOrder,
//   createOrderSlice,
//   initialState,
//   resetOrder
// } from '../newOrder/newOrder';
import { TOrder } from '@utils-types';
import {
  createOrder,
  createOrderSlice,
  initialState,
  resetOrder
} from './newOrder';

//мок для API
jest.mock('@api', () => ({
  orderBurgerApi: jest.fn()
}));

//тестовые данные
const mockIngredients = [
  '643d69a5c3f7b9001cfa093c',
  '643d69a5c3f7b9001cfa0941',
  '643d69a5c3f7b9001cfa093c'
];

const mockOrder: TOrder = {
  _id: '68c9745d673086001ba887a5',
  ingredients: mockIngredients,
  status: 'done',
  name: 'Краторный био-марсианский бургер',
  createdAt: '2025-09-16T14:29:49.829Z',
  updatedAt: '2025-09-16T14:29:51.043Z',
  number: 88827
};

const mockApiResponse = {
  success: true,
  order: mockOrder,
  name: 'Краторный био-марсианский бургер'
};

const mockError = new Error('Ошибка создания заказа');

describe('createOrder slice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //тест начального состояния\\
  describe('initial state', () => {
    test('должен возвращать начальное состояние с нулевыми данными заказа и без запроса', () => {
      const state = createOrderSlice.reducer(undefined, { type: '' });

      expect(state).toEqual(initialState);
    });
  });

  //тест действия resetOrder\\
  describe('resetOrder action', () => {
    test('следует вернуть состояние в исходное', () => {
      //предыдущее состояние с активным запросом, данными и ошибкой
      const previousState = {
        orderRequest: true,
        orderModalData: mockOrder,
        error: 'ошибка'
      };

      const state = createOrderSlice.reducer(previousState, resetOrder());

      //проверка, что состояние вернулось в исходное
      expect(state).toEqual(initialState);
    });
  });

  //тест начала создания заказа - pending\\
  describe('createOrder pending', () => {
    test('следует установить для OrderRequest значение true и устранить ошибку', () => {
      //создание действия
      const action = createOrder.pending('request-id', mockIngredients);

      //предыдущее состояние с ошибкой
      const previousState = {
        ...initialState,
        error: 'ошибка'
      };

      const state = createOrderSlice.reducer(previousState, action);

      //проверка результатов: запрос начался, ошибка очищена данные не изменились
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeUndefined();
      expect(state.orderModalData).toBeNull();
    });
  });

  //тест успешного создания заказа - fulfilled\\
  describe('createOrder fulfilled', () => {
    test('необходимо указать данные заказа и заполнить запрос', () => {
      //создание действия
      const action = createOrder.fulfilled(
        mockApiResponse,
        'request-id',
        mockIngredients
      );

      //предыдущее состояние с активным запросом
      const previousState = {
        orderRequest: true,
        orderModalData: null,
        error: undefined
      };

      const state = createOrderSlice.reducer(previousState, action);

      //проверка результатов: запрос завершился, нет ошибок, данные установлены
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.error).toBeUndefined();
    });

    //тест структуры данных заказа
    test('должен содержать правильную структуру данных о порядке', () => {
      //создание действия
      const action = createOrder.fulfilled(
        mockApiResponse,
        'request-id',
        mockIngredients
      );
      const state = createOrderSlice.reducer(initialState, action);

      //проверка данных
      expect(state.orderModalData).not.toBeNull();
      expect(state.orderModalData?._id).toBe('68c9745d673086001ba887a5');
      expect(state.orderModalData?.name).toBe(
        'Краторный био-марсианский бургер'
      );
      expect(state.orderModalData?.number).toBe(88827);
      expect(state.orderModalData?.status).toBe('done');
    });
  });

  //Тест ошибки создания заказа - rejected\\
  describe('createOrder rejected', () => {
    test('следует установить сообщение об ошибке и сохранить состояние запроса false', () => {
      //создание действия
      const action = createOrder.rejected(
        mockError,
        'request-id',
        mockIngredients
      );

      //предыдущее состояние с активным запросом
      const previousState = {
        orderRequest: true,
        orderModalData: null,
        error: undefined
      };

      const state = createOrderSlice.reducer(previousState, action);

      //проверка результата: запрос завершился, ошибка установлена, данные null
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка создания заказа');
      expect(state.orderModalData).toBeNull();
    });

    //тест обработки null
    test('следует корректно обрабатывать нулевую ошибку', () => {
      // объект с null
      const action = {
        type: createOrder.rejected.type,
        error: null,
        meta: {
          arg: mockIngredients,
          requestId: 'request-id',
          requestStatus: 'rejected'
        }
      };

      //состояние с активным запросом
      const state = createOrderSlice.reducer(
        { ...initialState, orderRequest: true },
        action
      );

      //проверка, что запрос завершился, ошибка undefined, данные - null
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBeUndefined();
      expect(state.orderModalData).toBeNull();
    });
  });

  //Тесты селекторов\\
  describe('createOrder selectors', () => {
    //тестовое состояние всего store
    const testState = {
      newOrder: {
        orderRequest: true,
        orderModalData: mockOrder,
        error: 'ошибка'
      }
    };

    //на возврат статуса запроса
    test('getOrderRequest должен возвращать статус запроса', () => {
      const result = createOrderSlice.selectors.getOrderRequest(testState);
      expect(result).toBe(true);
    });

    //на возврат данных заказа
    test('getOrderModalData должен возвращать данные заказа', () => {
      const result = createOrderSlice.selectors.getOrderModalData(testState);
      expect(result).toEqual(mockOrder);
      expect(result?.name).toBe('Краторный био-марсианский бургер');
    });
  });
});
