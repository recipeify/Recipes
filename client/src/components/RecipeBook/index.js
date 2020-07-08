import { connect } from 'react-redux';
import RecipeBook from './RecipeBook';
import { fetchUserRecipes } from '../../actions/userActions';

const mapStateToProps = (state) => ({
  token: state.user.token,
  userRecipes: state.user.recipes.items,
});

const mapDispatchToProps = (dispatch) => ({
  getUserRecipes: (token) => dispatch(fetchUserRecipes(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipeBook);
