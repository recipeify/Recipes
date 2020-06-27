import { connect } from 'react-redux';
import RecipeBook from './RecipeBook';
import { fetchUserRecipes, fetchUserPreferences } from '../../actions/userActions';

const mapStateToProps = (state) => ({
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  getUserRecipes: (token) => dispatch(fetchUserRecipes(token)),
  getUserPreferences: (token) => dispatch(fetchUserPreferences(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipeBook);
