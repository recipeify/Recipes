import { getIngredientDataset } from '../service/apiRequests';

export const FETCH_INGREDIENTS_PENDING = 'FETCH_INGREDIENTS_PENDING';
export const FETCH_INGREDIENTS_SUCCESS = 'FETCH_INGREDIENTS_SUCCESS';
export const FETCH_INGREDIENTS_FAILURE = 'FETCH_INGREDIENTS_FAILURE';

export const fetchIngredientsPending = () => ({
  type: FETCH_INGREDIENTS_PENDING,
});

export const fetchIngredientsSuccess = (ingredients) => ({
  type: FETCH_INGREDIENTS_SUCCESS,
  payload: { ingredients },
});

export const fetchIngredientsFailure = (error) => ({
  type: FETCH_INGREDIENTS_FAILURE,
  payload: { error },
});

export function fetchIngredients() {
  return async (dispatch) => {
    try {
      dispatch(fetchIngredientsPending());
      const response = await getIngredientDataset();
      dispatch(fetchIngredientsSuccess(response.items));
      return response.items;
    } catch (error) {
      return dispatch(fetchIngredientsFailure(error));
    }
  };
}

export default { fetchIngredients };
