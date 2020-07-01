/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import { exploreActions } from '../actions/exploreActions';

const initialState = {
  explore: [],
  loading: false,
  error: null,
};

export default function exploreReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case (exploreActions.CLEAR_EXPLORE):
        return initialState;
      case (exploreActions.FETCH_EXPLORE_PENDING):
        draft.loading = true;
        break;
      case (exploreActions.FETCH_EXPLORE_SUCCESS):
        draft.explore = action.payload;
        draft.loading = false;
        break;
      case (exploreActions.FETCH_EXPLORE_FAILURE):
        draft.error = action.payload.error;
        draft.loading = false;
        draft.explore = [];
        break;
      default:
        return state;
    }
  });
}
