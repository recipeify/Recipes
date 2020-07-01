import { searchByFilters } from '../service/apiRequests';

export const recipeActions = {
  FETCH_RECIPES_PENDING: 'FETCH_RECIPES_PENDING',
  FETCH_RECIPES_SUCCESS: 'FETCH_RECIPES_SUCCESS',
  FETCH_RECIPES_FAILURE: 'FETCH_RECIPES_FAILURE',
  UPDATE_RECIPE_SAVED: 'UPDATE_RECIPE_SAVED',
  REMOVE_RECIPE_USERPAGE: 'REMOVE_RECIPE_USERPAGE',
  SCROLL_RECIPES_PENDING: 'SCROLL_RECIPES_PENDING',
  SCROLL_RECIPES_FAILURE: 'SCROLL_RECIPES_FAILURE',
  SCROLL_RECIPES_SUCCESS: 'SCROLL_RECIPES_SUCCESS',
};

export const fetchRecipesPending = () => ({
  type: recipeActions.FETCH_RECIPES_PENDING,
});

export const fetchRecipesSuccess = (recipes) => ({
  type: recipeActions.FETCH_RECIPES_SUCCESS,
  payload: { recipes },
});

export const fetchRecipesFailure = (error) => ({
  type: recipeActions.FETCH_RECIPES_FAILURE,
  payload: { error },
});

export const updateRecipeSaved = (id, isSaved) => ({
  type: recipeActions.UPDATE_RECIPE_SAVED,
  payload: { id, value: isSaved },
});

export const scrollRecipesPending = () => ({
  type: recipeActions.SCROLL_RECIPES_PENDING,
});

export const scrollRecipesSuccess = (recipes) => ({
  type: recipeActions.SCROLL_RECIPES_SUCCESS,
  payload: { recipes },
});

export const scrollRecipesFailure = (error) => ({
  type: recipeActions.SCROLL_RECIPES_FAILURE,
  payload: { error },
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

export function scrollRecipes(
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
      dispatch(scrollRecipesPending());
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
      dispatch(scrollRecipesSuccess(response.items));
      return response.items;
    } catch (error) {
      return dispatch(scrollRecipesFailure(error));
    }
  };
}

export default { fetchRecipesByFilters, scrollRecipes };
