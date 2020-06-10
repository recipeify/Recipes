import { connect } from 'react-redux';
import get from 'lodash/get';
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
  }

  return {
    dataset,
    appliedPreferenceList,
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
