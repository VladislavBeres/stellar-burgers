import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuid } from 'uuid';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructorIngredient',
  initialState,
  reducers: {
    addItem: {
      reducer: (
        state: TConstructorState,
        action: PayloadAction<TConstructorIngredient>
      ) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TConstructorIngredient) => {
        const id = uuid();
        return { payload: { ...ingredient, id } };
      }
    },
    deleteItem: (
      state: TConstructorState,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    clearAll: (state: TConstructorState) => {
      state.bun = initialState.bun;
      state.ingredients = initialState.ingredients;
    },
    updateAll: (
      state: TConstructorState,
      action: PayloadAction<TConstructorIngredient[]>
    ) => {
      state.ingredients = action.payload;
    }
  },
  selectors: {
    selectItems: (state: TConstructorState) => state
  }
});

export const { addItem, deleteItem, clearAll, updateAll } =
  constructorSlice.actions;
export const { selectItems } = constructorSlice.selectors;
