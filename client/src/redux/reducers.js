import { combineReducers } from 'redux';
import recipeReducer from '../reducers/recipeReducer';
import searchReducer from '../reducers/searchReducer';

export default combineReducers({
  recipes: recipeReducer,
  filters: searchReducer,
});
