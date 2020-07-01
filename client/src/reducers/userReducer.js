/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import { userActions } from '../actions/userActions';

const initialState = {
  pending: true,
  loggedIn: false,
  user: {},
  token: '',
  recipes: {
    pending: false,
    error: null,
    items: [],
  },
  preferences: {
    pending: false,
    error: null,
    blacklist: [],
    diet: [],
  },
};

export default function userReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    switch (action.type) {
      case (userActions.AUTH_LOADING):
        draft.pending = action.payload;
        break;
      case (userActions.USER_LOGIN):
        draft.loggedIn = true;
        draft.user = action.payload.user;
        draft.token = action.payload.token;
        break;
      case (userActions.USER_LOGOUT):
        draft.loggedIn = false;
        return initialState;
      case (userActions.FETCH_USER_RECIPES_PENDING):
        draft.recipes.pending = true;
        break;
      case (userActions.FETCH_USER_RECIPES_SUCCESS):
        draft.recipes = {
          ...initialState.recipes,
          items: action.payload.recipes,
        };
        break;
      case (userActions.FETCH_USER_RECIPES_FAILURE):
        draft.recipes = {
          ...initialState.recipes,
          error: action.payload.error,
        };
        break;
      case (userActions.FETCH_USER_PREFERENCES_PENDING):
        draft.preferences.pending = true;
        break;
      case (userActions.FETCH_USER_PREFERENCES_SUCCESS):
        draft.preferences = {
          ...initialState.preferences,
          diet: action.payload.diet,
          blacklist: action.payload.excludeTerms,
        };
        break;
      case (userActions.FETCH_USER_PREFERENCES_FAILURE):
        draft.preferences = {
          ...initialState.preferences,
          error: action.payload.error,
        };
        break;
      case (userActions.REMOVE_RECIPE_USERPAGE):
        draft.recipes.items = draft.recipes.items.filter((recipe) => recipe.id !== action.payload);
        break;
      case (userActions.ADD_USER_BLACKLIST):
        draft.preferences.blacklist.push(action.payload);
        break;
      case (userActions.REMOVE_USER_BLACKLIST):
        draft.preferences.blacklist = draft.preferences.blacklist.filter(
          (item) => item.key !== action.payload.key,
        );
        break;
      case (userActions.ADD_USER_DIET):
        draft.preferences.diet.push(action.payload);
        break;
      case (userActions.REMOVE_USER_DIET):
        draft.preferences.diet = draft.preferences.diet.filter(
          (item) => item.key !== action.payload.key,
        );
        break;
      default:
        return draft;
    }
  });
}
