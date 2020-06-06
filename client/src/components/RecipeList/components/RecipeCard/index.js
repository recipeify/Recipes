import { connect } from 'react-redux';
import { reportView } from '../../../../actions/userActions';
import RecipeCard from './RecipeCard';


const mapStateToProps = (state) => ({
  isLoggedIn: state.user.loggedIn,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  viewRecipe: (recipeID, token) => dispatch(reportView(recipeID, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipeCard);
