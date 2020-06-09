import {
  sendView, getUserRecipes, addRecipes, removeRecipes,
} from '../service/apiRequests';
import { updateRecipeSaved } from './recipeActions';

export const userActions = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  REPORT_VIEW_PENDING: 'REPORT_VIEW_PENDING',
  REPORT_VIEW_SUCCESS: 'REPORT_VIEW_SUCCESS',
  REPORT_VIEW_FAILURE: 'REPORT_VIEW_FAILURE',
  ADD_RECIPE_PENDING: 'ADD_RECIPE_PENDING',
  ADD_RECIPE_SUCCESS: 'ADD_RECIPE_SUCCESS',
  ADD_RECIPE_FAILURE: 'ADD_RECIPE_FAILURE',
  REMOVE_RECIPE_PENDING: 'REMOVE_RECIPE_PENDING',
  REMOVE_RECIPE_SUCCESS: 'REMOVE_RECIPE_SUCCESS',
  REMOVE_RECIPE_FAILURE: 'REMOVE_RECIPE_FAILURE',
  REMOVE_RECIPE_USERPAGE: 'REMOVE_RECIPE_USERPAGE',
  FETCH_USER_RECIPES_PENDING: 'FETCH_USER_RECIPES_PENDING',
  FETCH_USER_RECIPES_SUCCESS: 'FETCH_USER_RECIPES_SUCCESS',
  FETCH_USER_RECIPES_FAILURE: 'FETCH_USER_RECIPES_FAILURE',
  EDIT_USER_PREFERENCES_PENDING: 'EDIT_USER_PREFERENCES_PENDING',
  EDIT_USER_PREFERENCES_SUCCESS: 'EDIT_USER_PREFERENCES_SUCCESS',
  EDIT_USER_PREFERENCES_FAILURE: 'EDIT_USER_PREFERENCES_FAILURE',
  ADD_USER_BLACKLIST: 'ADD_USER_BLACKLIST',
  REMOVE_USER_BLACKLIST: 'REMOVE_USER_BLACKLIST',
  ADD_USER_DIET: 'ADD_USER_DIET',
  REMOVE_USER_DIET: 'REMOVE_USER_DIET',
};

const userLogin = (data) => ({
  type: userActions.USER_LOGIN,
  payload: { ...data },
});

const userLogout = () => ({
  type: userActions.USER_LOGOUT,
});

const reportViewPending = () => ({
  type: userActions.REPORT_VIEW_PENDING,
});

const reportViewSuccess = () => ({
  type: userActions.REPORT_VIEW_SUCCESS,
});

const reportViewFailure = (error) => ({
  type: userActions.REPORT_VIEW_FAILURE,
  payload: { error },
});

function reportView(token, recipeID) {
  return async (dispatch) => {
    try {
      dispatch(reportViewPending());
      await sendView(token, recipeID);
      return dispatch(reportViewSuccess());
    } catch (error) {
      return dispatch(reportViewFailure(error));
    }
  };
}

const addRecipePending = () => ({
  type: userActions.ADD_RECIPE_PENDING,
});

const addRecipeSuccess = () => ({
  type: userActions.ADD_RECIPE_SUCCESS,
});

const addRecipeFailure = (error) => ({
  type: userActions.ADD_RECIPE_FAILURE,
  payload: { error },
});


function addRecipe(token, recipeID) {
  return async (dispatch) => {
    try {
      dispatch(addRecipePending());
      await addRecipes(token, [recipeID]);
      dispatch(updateRecipeSaved(recipeID, true));
      return dispatch(addRecipeSuccess());
    } catch (error) {
      return dispatch(addRecipeFailure(error));
    }
  };
}

const removeRecipePending = () => ({
  type: userActions.REMOVE_RECIPE_PENDING,
});

const removeRecipeSuccess = () => ({
  type: userActions.REMOVE_RECIPE_SUCCESS,
});

const removeRecipeFailure = (error) => ({
  type: userActions.REMOVE_RECIPE_FAILURE,
  payload: { error },
});

const removeRecipeUserPage = (id) => ({
  type: userActions.REMOVE_RECIPE_USERPAGE,
  payload: id,
});

function removeRecipe(token, recipeID) {
  return async (dispatch) => {
    try {
      dispatch(removeRecipePending());
      await removeRecipes(token, [recipeID]);
      dispatch(updateRecipeSaved(recipeID, false));
      dispatch(removeRecipeUserPage(recipeID));
      return dispatch(removeRecipeSuccess());
    } catch (error) {
      return dispatch(removeRecipeFailure(error));
    }
  };
}

const fetchUserRecipesPending = () => ({
  type: userActions.FETCH_USER_RECIPES_PENDING,
});

const fetchUserRecipesSuccess = (recipes) => ({
  type: userActions.FETCH_USER_RECIPES_SUCCESS,
  payload: { recipes },
});

const fetchUserRecipesFailure = (error) => ({
  type: userActions.FETCH_USER_RECIPES_FAILURE,
  payload: { error },
});

// eslint-disable-next-line arrow-body-style
const fetchUserRecipes = (token) => {
  return async (dispatch) => {
    try {
      dispatch(fetchUserRecipesPending());
      const response = await getUserRecipes(token);
      dispatch(fetchUserRecipesSuccess(response.items));
      return response.recipes;
    } catch (error) {
      return dispatch(fetchUserRecipesFailure(error));
    }
  };
};

const addUserDiet = (diet) => ({
  type: userActions.ADD_USER_DIET,
  payload: diet,
});

const removeUserDiet = (diet) => ({
  type: userActions.REMOVE_USER_DIET,
  payload: diet,
});

const addUserBlacklistItem = (ingredient) => ({
  type: userActions.ADD_USER_BLACKLIST,
  payload: ingredient,
});

const removeUserBlacklistItem = (ingredient) => ({
  type: userActions.REMOVE_USER_BLACKLIST,
  payload: ingredient,
});

// const editUserPreferencesPending = () => ({
//   type: userActions.EDIT_USER_PREFERENCES_PENDING,
// });

// const editUserPreferencesSuceess = () => ({
//   type: userActions.EDIT_USER_PREFERENCES_SUCCESS,
// });

// const editUserPreferencesFailure = (error) => ({
//   type: userActions.EDIT_USER_PREFERENCES_FAILURE,
//   payload: { error },
// });


// function editUserPreferences(token, preferences) {
//   return async (dispatch) => {
//     try {
//       dispatch(editUserPreferencesPending());
//       // await setUserPreferences(token, preferences);
//       return dispatch(editUserPreferencesSuceess());
//     } catch (error) {
//       return dispatch(editUserPreferencesFailure(error));
//     }
//   };
// }

export {
  userLogin,
  userLogout,
  reportView,
  addRecipe,
  removeRecipe,
  fetchUserRecipes,
  addUserDiet,
  removeUserDiet,
  addUserBlacklistItem,
  removeUserBlacklistItem,
  // editUserPreferences,
};
