import { connect } from 'react-redux';
import RecipeList from './RecipeList';

const mapStateToProps = (state, ownProps) => {
  const { siteMode } = ownProps;
  const recipes = siteMode === 'explore' ? state.recipes.items : state.user.recipes.items;
  const loading = siteMode === 'explore' ? state.recipes.loading : state.user.recipes.pending;
  const error = siteMode === 'explore' ? state.recipes.error : state.user.recipes.error;
  return ({
    recipes,
    loading,
    error,
    token: state.user.token,
    isLoggedIn: state.user.loggedIn,
  });
};

export default connect(mapStateToProps, null)(RecipeList);
