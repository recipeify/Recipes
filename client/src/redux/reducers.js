import { combineReducers } from 'redux';
import recipeReducer from '../reducers/recipeReducer';
import searchReducer from '../reducers/searchReducer';
import ingredientsReducer from '../reducers/ingredientsReducer';

export default combineReducers({
  recipes: recipeReducer,
  filters: searchReducer,
  ingredients: ingredientsReducer,
});
