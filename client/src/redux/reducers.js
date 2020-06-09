import { combineReducers } from 'redux';
import recipeReducer from '../reducers/recipeReducer';
import searchReducer from '../reducers/searchReducer';
import userReducer from '../reducers/userReducer';
import resourceReducer from '../reducers/resourceReducer';
import modeReducer from '../reducers/modeReducer';

export default combineReducers({
  mode: modeReducer,
  recipes: recipeReducer,
  filters: searchReducer,
  resources: resourceReducer,
  user: userReducer,
});
