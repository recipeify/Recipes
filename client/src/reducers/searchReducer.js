import { produce } from 'immer';
import pull from 'lodash/pull';

import { searchActions } from '../actions/searchActions';

const initialState = {
  // include: [
  //   'flour',
  //   'coconut',
  //   'coconut milk',
  //   'margarine',
  //   'almond milk',
  //   'ginger ale',
  //   'peaches',
  //   'strawberries',
  //   'blueberries',
  //   'bananas',
  //   'oranges',
  //   'tangerines',
  // ],
  include: [],
  exclude: [],
};

export default function searchReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    switch (action.type) {
      case (searchActions.ADD_INGREDIENT_TO_INCLUDE):
        draft.include.push(action.payload);
        break;
      case (searchActions.REMOVE_INGREDIENT_TO_INCLUDE):
        pull(draft.include, action.payload);
        break;
      case (searchActions.ADD_INGREDIENT_TO_EXCLUDE):
        draft.exclude.push(action.payload);
        break;
      case (searchActions.REMOVE_INGREDIENT_TO_EXCLUDE):
        pull(draft.exclude, action.payload);
        break;
      default:
        return draft;
    }
  });
}
