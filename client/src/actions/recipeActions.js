import { searchByFilters } from '../service/apiRequests';

export const FETCH_RECIPES_PENDING = 'FETCH_RECIPES_PENDING';
export const FETCH_RECIPES_SUCCESS = 'FETCH_RECIPES_SUCCESS';
export const FETCH_RECIPES_FAILURE = 'FETCH_RECIPES_FAILURE';
export const UPDATE_RECIPE_SAVED = 'UPDATE_RECIPE_SAVED';
export const REMOVE_RECIPE_USERPAGE = 'REMOVE_RECIPE_USERPAGE';

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

export const updateRecipeSaved = (id, isSaved) => ({
  type: UPDATE_RECIPE_SAVED,
  payload: { id, value: isSaved },
});


export function fetchRecipesByFilters(
  token,
  freeText,
  include,
  exclude,
  diet,
  dishType,
  cuisine,
  toCookTime,
  fromCookTime,
  from,
  size,
) {
  const includeTerms = include.map((item) => item.key);
  const excludeTerms = exclude.map((item) => item.key);
  return async (dispatch) => {
    try {
      dispatch(fetchRecipesPending());
      const response = await searchByFilters(
        token,
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
