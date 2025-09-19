import {
  getUserData,
  updateUser,
  registerUser,
  loginUser,
  logoutUser,
  userSlice,
  initialState
} from './user';
import { TRegisterData, TLoginData } from '@api';
import { TUser } from '@utils-types';
import { expect } from '@jest/globals';

//моки для API
jest.mock('@api', () => ({
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

//Тестовый пользователь\\
const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

//данные для регистрации
const mockRegisterData: TRegisterData = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

//данные для логина
const mockLoginData: TLoginData = {
  email: 'test@example.com',
  password: 'password123'
};

//данные для обновления профиля
const mockUpdateData: Partial<TRegisterData> = {
  name: 'Updated User'
};

//ответ API при успехе
const mockUserResponse = {
  user: mockUser,
  success: true,
  accessToken: 'mock-token',
  refreshToken: 'mock-refresh-token'
};

//ответ API при выходе
const mockLogoutResponse = {
  success: true,
  message: 'Logged out successfully'
};

//тестовая ошибка
const mockError = new Error('Ошибка аутентификации');

describe('user slice', () => {
  //очистка моков перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //тест начального состояния\\
  describe('initial state', () => {
    test('должен возвращать исходное состояние с пустыми пользовательскими данными и не проверенной авторизацией', () => {
      const state = userSlice.reducer(undefined, { type: '' });

      expect(state).toEqual(initialState);
    });
  });

  //тест начала действий - pending\\
  describe('pending actions', () => {
    test('следует установить состояние загрузки и устранить ошибку для любого ожидающего действия', () => {
      // создание массива действий
      const actions = [
        getUserData.pending('request-id', undefined),
        updateUser.pending('request-id', mockUpdateData),
        registerUser.pending('request-id', mockRegisterData),
        loginUser.pending('request-id', mockLoginData),
        logoutUser.pending('request-id', undefined)
      ];

      actions.forEach((action) => {
        //предыдущее состояние с ошибкой и выкл загрузкой
        const previousState = {
          ...initialState,
          error: 'ошибка',
          isLoading: false
        };

        const state = userSlice.reducer(previousState, action);

        //проверка, что получилось: загрузка on, нет ошибки, остальное не изменилось
        expect(state.isLoading).toBe(true);
        expect(state.error).toBe('');
        expect(state.isAuthChecked).toBe(false);
        expect(state.user).toEqual({ email: '', name: '' });
      });
    });
  });

  //тест успешных операций - fulfilled\\
  describe('fulfilled actions', () => {
    test('следует установить пользовательские данные, выполнить проверку подлинности и устранить ошибку при выполнении пользовательских операций', () => {
      //массив успешно выполненных действий
      const actions = [
        getUserData.fulfilled(mockUserResponse, 'request-id', undefined),
        updateUser.fulfilled(mockUserResponse, 'request-id', mockUpdateData),
        registerUser.fulfilled(
          mockUserResponse,
          'request-id',
          mockRegisterData
        ),
        loginUser.fulfilled(mockUserResponse, 'request-id', mockLoginData)
      ];

      actions.forEach((action) => {
        //предыдущее состояние с ошибкой и вкл загрузкой
        const previousState = {
          isAuthChecked: false,
          user: { email: '', name: '' },
          error: 'Предыдущая ошибка',
          isLoading: true
        };

        const state = userSlice.reducer(previousState, action);

        //проверка результатов: флаг аутентификации true, данные пользователя установились, ошибка очистилась, загрузка off
        expect(state.isAuthChecked).toBe(true);
        expect(state.user).toEqual(mockUser);
        expect(state.error).toBe('');
        expect(state.isLoading).toBe(false);
      });
    });

    //тест успешного выхода
    test('следует сбросить состояние при успешном выходе из системы', () => {
      //создание действия
      const action = logoutUser.fulfilled(
        mockLogoutResponse,
        'request-id',
        undefined
      );

      //предыдущее состояние с данными пользователя
      const previousState = {
        isAuthChecked: true,
        user: mockUser,
        error: 'Какая-то ошибка',
        isLoading: true
      };

      const state = userSlice.reducer(previousState, action);

      //проверка, что состояние сбросилось к начальному
      expect(state).toEqual(initialState);
    });
  });

  //тест ошибок операций - rejected\\
  describe('rejected actions', () => {
    test('следует установить сообщение об ошибке и завершить загрузку для любого отклоненного действия', () => {
      //массив действий с ошибкой
      const actions = [
        getUserData.rejected(mockError, 'request-id', undefined),
        updateUser.rejected(mockError, 'request-id', mockUpdateData),
        registerUser.rejected(mockError, 'request-id', mockRegisterData),
        loginUser.rejected(mockError, 'request-id', mockLoginData),
        logoutUser.rejected(mockError, 'request-id', undefined)
      ];

      actions.forEach((action) => {
        //предыдущее состояние с вкл загрузкой и без ошибок
        const previousState = {
          ...initialState,
          isLoading: true,
          error: ''
        };

        const state = userSlice.reducer(previousState, action);

        //проверка итогов: загрузка off, сообщение об ошибке, остальное не изменилось
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Ошибка аутентификации');
        expect(state.isAuthChecked).toBe(false);
        expect(state.user).toEqual({ email: '', name: '' });
      });
    });

    //тест обработки null
    test('следует корректно обрабатывать нулевую ошибку', () => {
      //создание действия с null
      const action = {
        type: getUserData.rejected.type,
        error: null,
        meta: {
          arg: undefined,
          requestId: 'request-id',
          requestStatus: 'rejected'
        }
      };

      //применение действия к состоянию
      const state = userSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      //проверка итогов
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('');
    });
  });

  //Тесты селекторов\\
  describe('user selectors', () => {
    //тестовое состояние всего store
    const testState = {
      user: {
        isAuthChecked: true,
        user: mockUser,
        error: 'Тестовая ошибка',
        isLoading: false
      }
    };

    //получение флага аутентификации
    test('isAuthCheckedSelector должен возвращать статус проверки подлинности', () => {
      const result = userSlice.selectors.isAuthCheckedSelector(testState);
      expect(result).toBe(true);
    });

    //получение данных пользователя
    test('getUser должен возвращать пользовательские данные', () => {
      const result = userSlice.selectors.getUser(testState);
      expect(result).toEqual(mockUser);
      expect(result.email).toBe('test@example.com');
    });

    //получение имени пользователя
    test('GetUserName должен возвращать имя пользователя', () => {
      const result = userSlice.selectors.getUserName(testState);
      expect(result).toBe('Test User');
    });

    //получение ошибки
    test('getError должен вернуть сообщение об ошибке', () => {
      const result = userSlice.selectors.getError(testState);
      expect(result).toBe('Тестовая ошибка');
    });
  });
});
