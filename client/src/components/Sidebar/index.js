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
  token: state.user.token,
  siteMode: state.mode.mode,
  user: state.user.user,
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
    from,
    size,
    token,
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
      token,
    ),
  ),
  getResources: () => dispatch(
    fetchResources(),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
