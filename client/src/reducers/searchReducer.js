/* eslint-disable no-param-reassign */
import { produce } from 'immer';

import { searchActions } from '../actions/searchActions';

const initialState = {
  // include: [
  //   'flour',
  //   'coconut',
  //   'coconut milk',
  //   'margarine',
  //   'almond milk',
  //   'ginger ale',
  //   'peaches',
  //   'strawberries',
  //   'blueberries',
  //   'bananas',
  //   'oranges',
  //   'tangerines',
  // ],
  freeText: '',
  include: [],
  exclude: [],
  diet: [],
  dishType: [],
  cuisine: [],
  fromCookTime: null,
  toCookTime: null,
};

export default function recipeReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    switch (action.type) {
      // Ingredients
      case (searchActions.ADD_INGREDIENT_TO_INCLUDE):
        if (typeof action.payload === 'string') {
          draft.include.push({ key: action.payload });
        } else {
          draft.include.push(action.payload);
        }
        break;
      case (searchActions.REMOVE_INGREDIENT_TO_INCLUDE):
        draft.include = draft.include.filter((item) => item.key !== action.payload.key);
        break;
      case (searchActions.ADD_INGREDIENT_TO_EXCLUDE):
        if (typeof action.payload === 'string') {
          draft.exclude.push({ key: action.payload });
        } else {
          draft.exclude.push(action.payload);
        }
        break;
      case (searchActions.REMOVE_INGREDIENT_TO_EXCLUDE):
        draft.exclude = draft.exclude.filter((item) => item.key !== action.payload.key);
        break;
      // Diet
      case (searchActions.ADD_DIETARY_PREFERENCE):
        if (typeof action.payload === 'string') {
          draft.diet.push({ key: action.payload });
        } else {
          draft.diet.push(action.payload);
        }
        break;
      case (searchActions.REMOVE_DIETARY_PREFERENCE):
        draft.diet = draft.diet.filter((item) => item.key !== action.payload.key);
        break;
      // Dish Type
      case (searchActions.ADD_DISH_TYPE):
        if (typeof action.payload === 'string') {
          draft.dishType.push({ key: action.payload });
        } else {
          draft.dishType.push(action.payload);
        }
        break;
      case (searchActions.REMOVE_DISH_TYPE):
        draft.dishType = draft.dishType.filter((item) => item.key !== action.payload.key);
        break;
      // Cuisine
      case (searchActions.ADD_CUISINE):
        if (typeof action.payload === 'string') {
          draft.cuisine.push({ key: action.payload });
        } else {
          draft.cuisine.push(action.payload);
        }
        break;
      case (searchActions.REMOVE_CUISINE):
        draft.cuisine = draft.cuisine.filter((item) => item.key !== action.payload.key);
        break;
      default:
        return draft;
      // Time
      case (searchActions.ADD_TIME_LIMIT):
        // eslint-disable-next-line prefer-destructuring
        draft.fromCookTime = action.payload[0];
        // eslint-disable-next-line prefer-destructuring
        draft.toCookTime = action.payload[1];
        break;
      case (searchActions.REMOVE_TIME_LIMIT):
        draft.fromCookTime = initialState.fromCookTime;
        draft.toCookTime = initialState.toCookTime;
        break;
      // Free text
      case (searchActions.ADD_FREE_TEXT):
        draft.freeText = action.payload;
    }
  });
}
