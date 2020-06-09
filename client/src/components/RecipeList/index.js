import { connect } from 'react-redux';
import RecipeList from './RecipeList';

const mapStateToProps = (state) => {
  const { mode } = state;
  const recipes = mode.mode === 'explore' ? state.recipes.items : state.user.recipes.items;
  const loading = mode.mode === 'explore' ? state.recipes.loading : state.user.recipes.pending;
  const error = mode.mode === 'explore' ? state.recipes.error : state.user.recipes.error;
  return ({
    recipes,
    loading,
    error,
    token: state.user.token,
    isLoggedIn: state.user.loggedIn,
  });
};

export default connect(mapStateToProps, null)(RecipeList);
