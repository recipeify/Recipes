import { connect } from 'react-redux';
import RecipeList from './RecipeList';
import { scrollRecipes } from '../../actions/recipeActions';

const mapStateToProps = (state, ownProps) => {
  const { siteMode } = ownProps;
  const recipes = siteMode === 'explore' ? state.recipes.items : state.user.recipes.items;
  const loading = siteMode === 'explore' ? state.recipes.loading : state.user.recipes.pending;
  const error = siteMode === 'explore' ? state.recipes.error : state.user.recipes.error;
  return ({
    freeText: state.filters.freeText,
    includeTerms: state.filters.include,
    excludeTerms: state.filters.exclude,
    diet: state.filters.diet,
    dishType: state.filters.dishType,
    cuisine: state.filters.cuisine,
    toCookTime: state.filters.toCookTime,
    fromCookTime: state.filters.fromCookTime,
    recipes,
    loading,
    error,
    token: state.user.token,
    isLoggedIn: state.user.loggedIn,
  });
};

const mapDispatchToProps = (dispatch) => ({
  scrollRecipes: (
    freeText,
    include,
    exclude,
    diet,
    dishType,
    cuisine,
    toCookTime,
    fromCookTime,
    from,
    size,
    token,
  ) => dispatch(
    scrollRecipes(
      freeText,
      include,
      exclude,
      diet,
      dishType,
      cuisine,
      toCookTime,
      fromCookTime,
      from,
      size,
      token,
    ),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipeList);
