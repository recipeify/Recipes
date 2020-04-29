export const searchActions = {
  ADD_INGREDIENT_TO_INCLUDE: 'ADD_INGREDIENT_TO_INCLUDE',
  REMOVE_INGREDIENT_TO_INCLUDE: 'REMOVE_INGREDIENT_TO_INCLUDE',
  ADD_INGREDIENT_TO_EXCLUDE: 'ADD_INGREDIENT_TO_EXCLUDE',
  REMOVE_INGREDIENT_TO_EXCLUDE: 'REMOVE_INGREDIENT_TO_EXCLUDE',
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

export {
  addIngredientToInclude,
  removeIngredientToInclude,
  addIngredientToExclude,
  removeIngredientToExclude,
};
