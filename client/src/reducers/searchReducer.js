import { produce } from 'immer';
import pull from 'lodash/pull';

import {
  ADD_INGREDIENT_TO_INCLUDE,
  REMOVE_INGREDIENT_TO_INCLUDE,
} from '../actions/searchActions';

const initialState = {
  include: [],
};

export default function recipeReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    switch (action.type) {
      case (ADD_INGREDIENT_TO_INCLUDE):
        draft.include.push(action.payload);
        break;
      case (REMOVE_INGREDIENT_TO_INCLUDE):
        pull(draft.include, action.payload);
        break;
      default:
        return draft;
    }
  });
}
