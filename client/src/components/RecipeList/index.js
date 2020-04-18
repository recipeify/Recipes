import { connect } from 'react-redux';
import { fetchRecipesByIngredients } from '../../actions/recipeActions';
import RecipeList from './RecipeList';

const mapDispatchToProps = (dispatch) => ({
  getRecipes: (terms, from, size) => dispatch(fetchRecipesByIngredients(terms, from, size)),
});

const mapStateToProps = (state) => ({
  recipes: state.recipes.items,
  loading: state.recipes.loading,
  error: state.recipes.error,
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipeList);
