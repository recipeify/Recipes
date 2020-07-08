/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import uniqBy from 'lodash/uniqBy';
import get from 'lodash/get';
import { searchActions } from '../actions/searchActions';
import { userActions } from '../actions/userActions';

const initialState = {
  // include: [
  //   {
  //     key: 'salt',
  //   },
  //   {
  //     key: 'pepper';
  //   },
  //   {
  //     key: 'butter',
  //   },
  //   {
  //     key: 'garlic',
  //   },
  //   {
  //     key: 'sugar',
  //   },
  //   {
  //     key: 'flour',
  //   },
  //   {
  //     key: 'onion',
  //   },
  //   {
  //     key: 'olive oil',
  //   },
  //   {
  //     key: 'water',
  //   },
  //   {
  //     key: 'olive',
  //   },
  //   {
  //     key: 'egg',
  //   },
  //   {
  //     key: 'black pepper',
  //   },
  //   {
  //     key: 'milk',
  //   },
  // ],
  filtersApplied: false,
  include: [],
  freeText: '',
  exclude: [],
  diet: [],
  dishType: [],
  cuisine: [],
  fromCookTime: null,
  toCookTime: null,
};

const areFiltersApplied = (state) => {
  const {
    include,
    freeText,
    exclude,
    diet,
    dishType,
    cuisine,
    fromCookTime,
    toCookTime,
  } = state;
  if (
    include.length === 0
    // exclude and diet lists are empty or include only presets
    && (exclude.length === 0 || exclude.filter((item) => (!get(item, 'preset', false))).length === 0)
    && (diet.length === 0 || diet.filter((item) => (!get(item, 'preset', false))).length === 0)
    && freeText === ''
    && dishType.length === 0
    && cuisine.length === 0
    && toCookTime === null
    && fromCookTime === null
  ) {
    return false;
  }
  return true;
};

let filtersAppliedDraft;
export default function searchReducer(state = initialState, action) {
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
        draft.filtersApplied = true;
        break;
      case (searchActions.REMOVE_INGREDIENT_TO_INCLUDE):
        draft.include = draft.include.filter((item) => item.key !== action.payload.key);
        filtersAppliedDraft = areFiltersApplied(draft);
        if (filtersAppliedDraft !== state.filtersApplied) {
          draft.filtersApplied = filtersAppliedDraft;
        }
        break;
      case (searchActions.ADD_INGREDIENT_TO_EXCLUDE):
        if (typeof action.payload === 'string') {
          draft.exclude.push({ key: action.payload });
        } else {
          draft.exclude.push(action.payload);
        }
        draft.filtersApplied = true;
        break;
      case (searchActions.REMOVE_INGREDIENT_TO_EXCLUDE):
        draft.exclude = draft.exclude.filter((item) => item.key !== action.payload.key);
        filtersAppliedDraft = areFiltersApplied(draft);
        if (filtersAppliedDraft !== state.filtersApplied) {
          draft.filtersApplied = filtersAppliedDraft;
        }
        break;
      // Diet
      case (searchActions.ADD_DIETARY_PREFERENCE):
        if (typeof action.payload === 'string') {
          draft.diet.push({ key: action.payload });
        } else {
          draft.diet.push(action.payload);
        }
        draft.filtersApplied = true;
        break;
      case (searchActions.REMOVE_DIETARY_PREFERENCE):
        draft.diet = draft.diet.filter((item) => item.key !== action.payload.key);
        filtersAppliedDraft = areFiltersApplied(draft);
        if (filtersAppliedDraft !== state.filtersApplied) {
          draft.filtersApplied = filtersAppliedDraft;
        }
        break;
      // Dish Type
      case (searchActions.ADD_DISH_TYPE):
        if (typeof action.payload === 'string') {
          draft.dishType.push({ key: action.payload });
        } else {
          draft.dishType.push(action.payload);
        }
        draft.filtersApplied = true;
        break;
      case (searchActions.REMOVE_DISH_TYPE):
        draft.dishType = draft.dishType.filter((item) => item.key !== action.payload.key);
        filtersAppliedDraft = areFiltersApplied(draft);
        if (filtersAppliedDraft !== state.filtersApplied) {
          draft.filtersApplied = filtersAppliedDraft;
        }
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
        filtersAppliedDraft = areFiltersApplied(draft);
        if (filtersAppliedDraft !== state.filtersApplied) {
          draft.filtersApplied = filtersAppliedDraft;
        }
        draft.filtersApplied = true;
        break;
      default:
        return draft;
      // Time
      case (searchActions.ADD_TIME_LIMIT):
        // eslint-disable-next-line prefer-destructuring
        draft.fromCookTime = action.payload[0];
        // eslint-disable-next-line prefer-destructuring
        draft.toCookTime = action.payload[1];
        draft.filtersApplied = true;
        break;
      case (searchActions.REMOVE_TIME_LIMIT):
        draft.fromCookTime = initialState.fromCookTime;
        draft.toCookTime = initialState.toCookTime;
        filtersAppliedDraft = areFiltersApplied(draft);
        if (filtersAppliedDraft !== state.filtersApplied) {
          draft.filtersApplied = filtersAppliedDraft;
        }
        break;
      // Free text
      case (searchActions.ADD_FREE_TEXT):
        draft.freeText = action.payload;
        filtersAppliedDraft = areFiltersApplied(draft);
        if (filtersAppliedDraft !== state.filtersApplied) {
          draft.filtersApplied = filtersAppliedDraft;
        }
        break;
      // User preferences
      case (userActions.FETCH_USER_PREFERENCES_SUCCESS):
        draft.exclude = uniqBy(draft.exclude.concat(
          action.payload.excludeTerms.map((term) => ({ ...term, preset: true })),
        ), 'key');
        draft.diet = uniqBy(draft.diet.concat(
          action.payload.diet.map((term) => ({ ...term, preset: true })),
        ), 'key');
        break;
      case (userActions.ADD_USER_BLACKLIST):
        draft.exclude.push({ ...action.payload, preset: true });
        break;
      case (userActions.REMOVE_USER_BLACKLIST):
        draft.exclude = draft.exclude.filter(
          (item) => item.key !== action.payload.key,
        );
        break;
      case (userActions.ADD_USER_DIET):
        draft.diet.push({ ...action.payload, preset: true });
        break;
      case (userActions.REMOVE_USER_DIET):
        draft.diet = draft.diet.filter(
          (item) => item.key !== action.payload.key,
        );
        break;
    }
  });
}
