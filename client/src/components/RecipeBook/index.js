import { connect } from 'react-redux';
import RecipeBook from './RecipeBook';
import { fetchUserRecipes, fetchRecentlyViewed } from '../../actions/userActions';

const mapStateToProps = (state) => ({
  token: state.user.token,
  userRecipes: state.user.recipes.items,
  authLoading: state.user.pending,
});

const mapDispatchToProps = (dispatch) => ({
  getUserRecipes: (token) => dispatch(fetchUserRecipes(token)),
  getRecentlyViewed: (token) => dispatch(fetchRecentlyViewed(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipeBook);
