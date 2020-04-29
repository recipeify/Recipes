import { connect } from 'react-redux';
import IngredientSearch from './IngredientSearch';
import {
  addIngredientToInclude,
  removeIngredientToInclude,
  addIngredientToExclude,
  removeIngredientToExclude,
} from '../../../actions/searchActions';

const mapStateToProps = (state, ownProps) => {
  const { filters } = state;
  return {
    ingredientList: ownProps.include ? filters.include : filters.exclude,
    includeItems: filters.include,
    excludeItems: filters.exclude,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const addIngredientAction = ownProps.include
    ? addIngredientToInclude : addIngredientToExclude;
  const removeIngredientAction = ownProps.include
    ? removeIngredientToInclude : removeIngredientToExclude;
  return {
    addIngredient: (ingredient) => dispatch(addIngredientAction(ingredient)),
    removeIngredient: (ingredient) => dispatch(removeIngredientAction(ingredient)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IngredientSearch);
