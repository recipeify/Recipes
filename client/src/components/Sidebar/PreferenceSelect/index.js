import { connect } from 'react-redux';
import get from 'lodash/get';
import PreferenceSelect, { sidebarSelects } from './PreferenceSelect';
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
  [sidebarSelects.INCLUDE_INGREDIENTS]: {
    add: addIngredientToInclude,
    remove: removeIngredientToInclude,
  },
  [sidebarSelects.EXCLUDE_INGREDIENTS]: {
    add: addIngredientToExclude,
    remove: removeIngredientToExclude,
  },
  [sidebarSelects.DIET]: {
    add: addDietaryPreference,
    remove: removeDietaryPreference,
  },
  [sidebarSelects.DISH_TYPE]: {
    add: addDishType,
    remove: removeDishType,
  },
  [sidebarSelects.CUISINE]: {
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
    case (sidebarSelects.INCLUDE_INGREDIENTS):
      appliedPreferenceList = state.filters.include;
      break;
    case (sidebarSelects.EXCLUDE_INGREDIENTS):
      appliedPreferenceList = state.filters.exclude;
      break;
    case (sidebarSelects.DIET):
      appliedPreferenceList = state.filters.diet;
      break;
    case (sidebarSelects.DISH_TYPE):
      appliedPreferenceList = state.filters.dishType;
      break;
    case (sidebarSelects.CUISINE):
      appliedPreferenceList = state.filters.cuisine;
      break;
  }
  let dataset;
  // eslint-disable-next-line default-case
  switch (variant) {
    case (sidebarSelects.INCLUDE_INGREDIENTS):
      dataset = resources.ingredients;
      break;
    case (sidebarSelects.EXCLUDE_INGREDIENTS):
      dataset = resources.ingredients;
      break;
    case (sidebarSelects.DIET):
      dataset = resources.diets;
      break;
    case (sidebarSelects.DISH_TYPE):
      dataset = resources.mealTypes;
      break;
    case (sidebarSelects.CUISINE):
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
