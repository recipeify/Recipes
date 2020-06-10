/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import { userActions } from '../actions/userActions';

const initialState = {
  loggedIn: false,
  user: {},
  token: '',
  recipes: {
    pending: false,
    error: null,
    items: [],
  },
};

export default function userReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    switch (action.type) {
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
        return {
          ...initialState,
          error: action.payload.error,
        };
      case (userActions.REMOVE_RECIPE_USERPAGE):
        draft.recipes.items = draft.recipes.items.filter((recipe) => recipe.id !== action.payload);
        break;
      default:
        return draft;
    }
  });
}
