/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import { get } from 'lodash';
import { exploreActions } from '../actions/exploreActions';

const initialState = {
  explore: [],
  popular: [],
  personal: [],
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
        draft = { ...initialState };
        draft.explore = action.payload.explore;
        if (get(action.payload, 'popular')) {
          draft.popular = action.payload.popular;
        }
        if (get(action.payload, 'personal')) {
          draft.personal = action.payload.personal;
        }
        return draft;
      case (exploreActions.FETCH_EXPLORE_FAILURE):
        draft = { ...initialState };
        draft.error = action.payload.error;
        break;
      default:
        return state;
    }
  });
}
