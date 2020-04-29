import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import { fetchRecipesByIngredients } from '../../actions/recipeActions';

const mapStateToProps = (state) => ({
  includeTerms: state.filters.include,
  excludeTerms: state.filters.exclude,
});

const mapDispatchToProps = (dispatch) => ({
  getRecipesByIngredients: (includeTerms, excludeTerms, from = 0, size = 30) => dispatch(
    fetchRecipesByIngredients(includeTerms || [], excludeTerms || [], from, size),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
