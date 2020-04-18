import { connect } from 'react-redux';
import IngredientSearch from './IngredientSearch';
import { addIngredientToInclude, removeIngredientToInclude } from '../../../actions/searchActions';
import { fetchRecipesByIngredients } from '../../../actions/recipeActions';

const mapStateToProps = (state, ownProps) => {
  const { filters } = state;
  return {
    ingredientList: ownProps.include ? filters.include : null,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const addIngredientAction = ownProps.include ? addIngredientToInclude : null;
  const removeIngredientAction = ownProps.include ? removeIngredientToInclude : null;
  return {
    getRecipes:
      (terms, from = 0, size = 30) => dispatch(fetchRecipesByIngredients(terms, from, size)),
    addIngredient: (ingredient) => dispatch(addIngredientAction(ingredient)),
    removeIngredient: (ingredient) => dispatch(removeIngredientAction(ingredient)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IngredientSearch);
