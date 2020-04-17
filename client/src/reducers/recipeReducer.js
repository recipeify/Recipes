import {
  FETCH_RECIPES_PENDING,
  FETCH_RECIPES_SUCCESS,
  FETCH_RECIPES_FAILURE,
} from '../actions/recipeActions';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export default function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_RECIPES_PENDING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_RECIPES_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.recipes,
      };

    case FETCH_RECIPES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        items: [],
      };

    default:
      return state;
  }
}
