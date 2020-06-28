/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import produce from 'immer';
import { recipeActions } from '../actions/recipeActions';

const initialState = {
  items: [],
  loading: true,
  error: null,
  scroll: {
    loading: false,
    error: null,
  },
};

export default function recipeReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    switch (action.type) {
      case recipeActions.FETCH_RECIPES_PENDING:
        draft.loading = true;
        break;
      case recipeActions.FETCH_RECIPES_SUCCESS:
        draft.loading = false;
        draft.items = action.payload.recipes;
        break;
      case recipeActions.FETCH_RECIPES_FAILURE:
        return {
          loading: false,
          error: action.payload.error,
          items: [],
        };
      case recipeActions.UPDATE_RECIPE_SAVED:
        draft.items = draft.items.map((i) => {
          if (i.id === action.payload.id) {
            return { ...i, isSaved: action.payload.value };
          } return i;
        });
        break;
      case recipeActions.SCROLL_RECIPES_PENDING:
        draft.scroll.loading = true;
        break;
      case recipeActions.SCROLL_RECIPES_SUCCESS:
        draft.scroll.loading = false;
        draft.items = [...draft.items, ...action.payload.recipes];
        break;
      default:
        return state;
    }
  });
}
