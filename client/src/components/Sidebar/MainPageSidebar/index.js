import { connect } from 'react-redux';
import { fetchRecipesByFilters } from '../../../actions/recipeActions';
import { fetchResources } from '../../../actions/resourceActions';
import { fetchUserPreferences } from '../../../actions/userActions';
import MainPageSidebar from './MainPageSidebar';

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
  user: state.user.user,
  dietsDataset: state.resources.diets,
  ingredientsDataset: state.resources.ingredients,
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
  getUserPreferences: (token, ingredients, diets) => {
    dispatch(fetchUserPreferences(token, ingredients, diets));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPageSidebar);
