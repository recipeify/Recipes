import { combineReducers } from 'redux';
import recipeReducer from '../reducers/recipeReducer';
import searchReducer from '../reducers/searchReducer';
import userReducer from '../reducers/userReducer';
import resourceReducer from '../reducers/resourceReducer';
import exploreReducer from '../reducers/exploreReducer';

export default combineReducers({
  explore: exploreReducer,
  recipes: recipeReducer,
  filters: searchReducer,
  resources: resourceReducer,
  user: userReducer,
});
