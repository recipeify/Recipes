import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import { fetchRecipesByFilters } from '../../actions/recipeActions';
import { fetchResources } from '../../actions/resourceActions';

const mapStateToProps = (state) => ({
  freeText: state.filters.freeText,
  includeTerms: state.filters.include,
  excludeTerms: state.filters.exclude,
  diet: state.filters.diet,
  dishType: state.filters.dishType,
  cuisine: state.filters.cuisine,
  toCookTime: state.filters.toCookTime,
  fromCookTime: state.filters.fromCookTime,
});

const mapDispatchToProps = (dispatch) => ({
  getRecipesByFilters: (
    freeText,
    include,
    exclude,
    diet,
    dishType,
    cuisine,
    toCookTime,
    fromCookTime,
    from = 0,
    size = 30,
  ) => dispatch(
    fetchRecipesByFilters(
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
    ),
  ),
  getResources: () => dispatch(
    fetchResources(),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
