export const ADD_INGREDIENT_TO_INCLUDE = 'ADD_INGREDIENT_TO_INCLUDE';
export const REMOVE_INGREDIENT_TO_INCLUDE = 'REMOVE_INGREDIENT_TO_INCLUDE';


const addIngredientToInclude = (ingredient) => ({
  type: ADD_INGREDIENT_TO_INCLUDE,
  payload: ingredient,
});

const removeIngredientToInclude = (ingredient) => ({
  type: REMOVE_INGREDIENT_TO_INCLUDE,
  payload: ingredient,
});

export {
  addIngredientToInclude,
  removeIngredientToInclude,
};
