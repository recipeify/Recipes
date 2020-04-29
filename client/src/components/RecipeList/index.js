import { connect } from 'react-redux';
// import { fetchRecipesByIngredients } from '../../actions/recipeActions';
import RecipeList from './RecipeList';

// const mapDispatchToProps = (dispatch) => ({
//   getRecipes:
//     (
//       includeTerms = [],
//       excludeTerms = [],
//       from,
//       size,
//     ) => dispatch(
//       fetchRecipesByIngredients(includeTerms, excludeTerms, from, size),
//     ),
// });

const mapStateToProps = (state) => ({
  recipes: state.recipes.items,
  loading: state.recipes.loading,
  error: state.recipes.error,
});

export default connect(mapStateToProps, null)(RecipeList);
