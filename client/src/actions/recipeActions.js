import { searchByIngredients } from '../service/apiRequests';

export const FETCH_RECIPES_PENDING = 'FETCH_RECIPES_PENDING';
export const FETCH_RECIPES_SUCCESS = 'FETCH_RECIPES_SUCCESS';
export const FETCH_RECIPES_FAILURE = 'FETCH_RECIPES_FAILURE';

export const fetchRecipesPending = () => ({
  type: FETCH_RECIPES_PENDING,
});

export const fetchRecipesSuccess = (recipes) => ({
  type: FETCH_RECIPES_SUCCESS,
  payload: { recipes },
});

export const fetchRecipesFailure = (error) => ({
  type: FETCH_RECIPES_FAILURE,
  payload: { error },
});

export function fetchRecipesByIngredients(terms, from = 0, size = 10) {
  return async (dispatch) => {
    try {
      dispatch(fetchRecipesPending());
      const response = await searchByIngredients(terms, from, size);
      dispatch(fetchRecipesSuccess(response.items));
      return response.items;
    } catch (error) {
      return dispatch(fetchRecipesFailure(error));
    }
  };
}

export default { fetchRecipesByIngredients };
