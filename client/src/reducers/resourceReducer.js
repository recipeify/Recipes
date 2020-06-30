/* eslint-disable no-param-reassign */
import { produce } from 'immer';

import {
  FETCH_RESOURCES_PENDING,
  FETCH_RESOURCES_SUCCESS,
  FETCH_RESOURCES_FAILURE,
} from '../actions/resourceActions';

const initialState = {
  resources: {
    ingredients: [],
    diets: [],
    events: [],
    mealType: [],
  },
  loading: false,
  error: null,
};

export default function resourceReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case FETCH_RESOURCES_PENDING:
        draft.loading = true;
        draft.error = null;
        break;
      case FETCH_RESOURCES_SUCCESS:
        return {
          ...state,
          loading: false,
          resources: { ...action.payload },
        };
      case FETCH_RESOURCES_FAILURE:
        draft.loading = false;
        draft.error = action.payload.error;
        draft.resources = { ...initialState.resources };
        break;
    }
  });
}
