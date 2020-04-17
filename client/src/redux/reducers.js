import { combineReducers } from 'redux';
import recipeReducer from '../reducers/recipeReducer';

export default combineReducers({
  recipes: recipeReducer,
});
