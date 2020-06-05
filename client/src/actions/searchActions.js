export const searchActions = {
  ADD_INGREDIENT_TO_INCLUDE: 'ADD_INGREDIENT_TO_INCLUDE',
  REMOVE_INGREDIENT_TO_INCLUDE: 'REMOVE_INGREDIENT_TO_INCLUDE',
  ADD_INGREDIENT_TO_EXCLUDE: 'ADD_INGREDIENT_TO_EXCLUDE',
  REMOVE_INGREDIENT_TO_EXCLUDE: 'REMOVE_INGREDIENT_TO_EXCLUDE',
  ADD_DIETARY_PREFERENCE: 'ADD_DIETARY_PREFERENCE',
  REMOVE_DIETARY_PREFERENCE: 'REMOVE_DIETARY_PREFERENCE',
  ADD_DISH_TYPE: 'ADD_DISH_TYPE',
  REMOVE_DISH_TYPE: 'REMOVE_DISH_TYPE',
  ADD_CUISINE: 'ADD_CUISINE',
  REMOVE_CUISINE: 'REMOVE_CUISINE',
  ADD_TIME_LIMIT: 'ADD_TIME_LIMIT',
  REMOVE_TIME_LIMIT: 'REMOVE_TIME_LIMIT',
  ADD_FREE_TEXT: 'ADD_FREE_TEXT',
};

const addIngredientToInclude = (ingredient) => ({
  type: searchActions.ADD_INGREDIENT_TO_INCLUDE,
  payload: ingredient,
});

const removeIngredientToInclude = (ingredient) => ({
  type: searchActions.REMOVE_INGREDIENT_TO_INCLUDE,
  payload: ingredient,
});

const addIngredientToExclude = (ingredient) => ({
  type: searchActions.ADD_INGREDIENT_TO_EXCLUDE,
  payload: ingredient,
});

const removeIngredientToExclude = (ingredient) => ({
  type: searchActions.REMOVE_INGREDIENT_TO_EXCLUDE,
  payload: ingredient,
});

const addDietaryPreference = (diet) => ({
  type: searchActions.ADD_DIETARY_PREFERENCE,
  payload: diet,
});

const removeDietaryPreference = (diet) => ({
  type: searchActions.REMOVE_DIETARY_PREFERENCE,
  payload: diet,
});

const addDishType = (dishType) => ({
  type: searchActions.ADD_DISH_TYPE,
  payload: dishType,
});

const removeDishType = (dishType) => ({
  type: searchActions.REMOVE_DISH_TYPE,
  payload: dishType,
});


const addCuisine = (cuisine) => ({
  type: searchActions.ADD_CUISINE,
  payload: cuisine,
});

const removeCuisine = (cuisine) => ({
  type: searchActions.REMOVE_CUISINE,
  payload: cuisine,
});

const addTimeRange = (range) => ({
  type: searchActions.ADD_TIME_LIMIT,
  payload: range,
});

const removeTimeRange = () => ({
  type: searchActions.REMOVE_TIME_LIMIT,
});

const addFreeText = (term) => ({
  type: searchActions.ADD_FREE_TEXT,
  payload: term,
});

export {
  addIngredientToInclude,
  removeIngredientToInclude,
  addIngredientToExclude,
  removeIngredientToExclude,
  addDietaryPreference,
  removeDietaryPreference,
  addDishType,
  removeDishType,
  addCuisine,
  removeCuisine,
  addTimeRange,
  removeTimeRange,
  addFreeText,
};
