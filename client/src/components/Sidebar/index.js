import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import { fetchRecipesByIngredients } from '../../actions/recipeActions';
import { fetchIngredients } from '../../actions/ingredientsActions';

const mapStateToProps = (state) => ({
  includeTerms: state.filters.include,
  excludeTerms: state.filters.exclude,
});

const mapDispatchToProps = (dispatch) => ({
  getRecipesByIngredients: (includeTerms, excludeTerms, from = 0, size = 30) => dispatch(
    fetchRecipesByIngredients(includeTerms || [], excludeTerms || [], from, size),
  ),
  getIngredientDataset: () => dispatch(
    fetchIngredients(),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
