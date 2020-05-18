/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import { userActions } from '../actions/userActions';

const initialState = {
  loggedIn: false,
  user: {},
};

export default function recipeReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    switch (action.type) {
      case (userActions.USER_LOGIN):
        draft.loggedIn = true;
        draft.user = action.payload;
        break;
      case (userActions.USER_LOGOUT):
        draft.loggedIn = false;
        return initialState;
      default:
        return draft;
    }
  });
}
