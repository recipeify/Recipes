import { searchByFilters } from '../service/apiRequests';

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

export function fetchRecipesByFilters(
  freeText,
  include,
  exclude,
  diet,
  dishType,
  cuisine,
  toCookTime,
  fromCookTime,
  from = 0,
  size = 10,
) {
  const includeTerms = include.map((item) => item.key);
  const excludeTerms = exclude.map((item) => item.key);
  return async (dispatch) => {
    try {
      dispatch(fetchRecipesPending());
      const response = await searchByFilters(
        freeText,
        includeTerms,
        excludeTerms,
        diet,
        cuisine,
        dishType,
        toCookTime,
        fromCookTime,
        from,
        size,
      );
      dispatch(fetchRecipesSuccess(response.items));
      return response.items;
    } catch (error) {
      return dispatch(fetchRecipesFailure(error));
    }
  };
}

export default { fetchRecipesByFilters };
