import { connect } from 'react-redux';
import { reportView, addRecipe, removeRecipe } from '../../../../actions/userActions';
import RecipeCard from './RecipeCard';


const mapStateToProps = (state) => ({
  isLoggedIn: state.user.loggedIn,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  viewRecipe: (token, recipeID) => dispatch(reportView(token, recipeID)),
  addRecipe: (token, recipeID) => dispatch(addRecipe(token, recipeID)),
  removeRecipe: (token, recipeID) => dispatch(removeRecipe(token, recipeID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipeCard);
