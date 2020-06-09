import { connect } from 'react-redux';
import RecipeList from './RecipeList';

const mapStateToProps = (state) => ({
  recipes: state.recipes.items,
  loading: state.recipes.loading,
  error: state.recipes.error,
});

export default connect(mapStateToProps, null)(RecipeList);
