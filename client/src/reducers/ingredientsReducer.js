import {
  FETCH_INGREDIENTS_PENDING,
  FETCH_INGREDIENTS_SUCCESS,
  FETCH_INGREDIENTS_FAILURE,
} from '../actions/ingredientsActions';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export default function ingredientsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_INGREDIENTS_PENDING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_INGREDIENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.ingredients,
      };

    case FETCH_INGREDIENTS_FAILURE:
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
