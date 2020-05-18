import { combineReducers } from 'redux';
import recipeReducer from '../reducers/recipeReducer';
import searchReducer from '../reducers/searchReducer';
import ingredientsReducer from '../reducers/ingredientsReducer';
import userReducer from '../reducers/userReducer';

export default combineReducers({
  recipes: recipeReducer,
  filters: searchReducer,
  ingredients: ingredientsReducer,
  user: userReducer,
});
