import { connect } from 'react-redux';
import get from 'lodash/get';
import { sample, isEmpty } from 'lodash';
import PreferenceSelect, { selectVariants } from './PreferenceSelect';
import {
  addIngredientToInclude,
  removeIngredientToInclude,
  addIngredientToExclude,
  removeIngredientToExclude,
  addDietaryPreference,
  removeDietaryPreference,
  addDishType,
  removeDishType,
  addCuisine,
  removeCuisine,
} from '../../../actions/searchActions';
import {
  addUserDiet,
  removeUserDiet,
  addUserBlacklistItem,
  removeUserBlacklistItem,
} from '../../../actions/userActions';

const actions = {
  [selectVariants.INCLUDE_INGREDIENTS]: {
    add: addIngredientToInclude,
    remove: removeIngredientToInclude,
  },
  [selectVariants.EXCLUDE_INGREDIENTS]: {
    add: addIngredientToExclude,
    remove: removeIngredientToExclude,
  },
  [selectVariants.DIET]: {
    add: addDietaryPreference,
    remove: removeDietaryPreference,
  },
  [selectVariants.DISH_TYPE]: {
    add: addDishType,
    remove: removeDishType,
  },
  [selectVariants.CUISINE]: {
    add: addCuisine,
    remove: removeCuisine,
  },
  [selectVariants.PERSONAL_DIET]: {
    add: addUserDiet,
    remove: removeUserDiet,
  },
  [selectVariants.PERSONAL_EXCLUDES]: {
    add: addUserBlacklistItem,
    remove: removeUserBlacklistItem,
  },
};

const mapStateToProps = (state, ownProps) => {
  const resources = get(state, 'resources.resources');
  const { variant } = ownProps;
  let appliedPreferenceList;
  // eslint-disable-next-line default-case
  switch (variant) {
    case (selectVariants.INCLUDE_INGREDIENTS):
      appliedPreferenceList = state.filters.include;
      break;
    case (selectVariants.EXCLUDE_INGREDIENTS):
      appliedPreferenceList = state.filters.exclude;
      break;
    case (selectVariants.DIET):
      appliedPreferenceList = state.filters.diet;
      break;
    case (selectVariants.DISH_TYPE):
      appliedPreferenceList = state.filters.dishType;
      break;
    case (selectVariants.CUISINE):
      appliedPreferenceList = state.filters.cuisine;
      break;
    case (selectVariants.PERSONAL_EXCLUDES):
      appliedPreferenceList = state.user.preferences.blacklist;
      break;
    case (selectVariants.PERSONAL_DIET):
      appliedPreferenceList = state.user.preferences.diet;
      break;
  }
  let dataset;
  // eslint-disable-next-line default-case
  switch (variant) {
    case (selectVariants.INCLUDE_INGREDIENTS):
      dataset = resources.ingredients;
      break;
    case (selectVariants.EXCLUDE_INGREDIENTS):
      dataset = resources.ingredients;
      break;
    case (selectVariants.DIET):
      dataset = resources.diets;
      break;
    case (selectVariants.DISH_TYPE):
      dataset = resources.mealTypes;
      break;
    case (selectVariants.CUISINE):
      dataset = resources.cuisine;
      break;
    case (selectVariants.PERSONAL_EXCLUDES):
      dataset = resources.ingredients;
      break;
    case (selectVariants.PERSONAL_DIET):
      dataset = resources.diets;
      break;
  }
  let placeholder = '';
  if (!isEmpty(dataset)) {
    const randomItem = sample(dataset);
    placeholder = `try ${randomItem.key}`;
  }
  return {
    dataset,
    appliedPreferenceList,
    placeholder,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { variant } = ownProps;
  const variantActions = get(actions, variant);
  const { add, remove } = variantActions;
  return {
    addPreference: (preference) => dispatch(add(preference)),
    removePreference: (preference) => dispatch(remove(preference)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreferenceSelect);
