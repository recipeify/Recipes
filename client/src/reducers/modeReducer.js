import { modeActions } from '../actions/modeActions';

const initialState = {
  mode: 'explore',
};

export default function modeReducer(state = initialState, action) {
  switch (action.type) {
    case (modeActions.SWITCH_TO_EXPLORE):
      return { mode: 'explore' };
    case (modeActions.SWITCH_TO_MY_RECIPES):
      return { mode: 'myRecipes' };
    default:
      return state;
  }
}
