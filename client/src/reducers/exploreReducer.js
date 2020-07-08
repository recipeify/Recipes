/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import { get } from 'lodash';
import { exploreActions } from '../actions/exploreActions';

const initialState = {
  explore: [],
  popular: [],
  personal: [],
  mealByTime: {},
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
        if (get(action.payload, 'mealByTime')) {
          draft.mealByTime = action.payload.mealByTime;
        }
        return draft;
      case exploreActions.UPDATE_EXPLORE_SAVED:
        draft.explore = draft.explore.map((i) => {
          i.recipes = i.recipes.map((j) => {
            if (j.id === action.payload.id) {
              return { ...j, isSaved: action.payload.value };
            } return j;
          });
          return i;
        });
        draft.popular = draft.popular.map((i) => {
          if (i.id === action.payload.id) {
            return { ...i, isSaved: action.payload.value };
          } return i;
        });
        draft.personal = draft.personal.map((i) => {
          if (i.id === action.payload.id) {
            return { ...i, isSaved: action.payload.value };
          } return i;
        });
        draft.mealByTime.recipes = draft.mealByTime.recipes.map((i) => {
          if (i.id === action.payload.id) {
            return { ...i, isSaved: action.payload.value };
          } return i;
        });
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
