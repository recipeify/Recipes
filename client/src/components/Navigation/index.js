import { connect } from 'react-redux';
import Navigation from './Navigation';
import {
  userLogin, userLogout, fetchUserPreferences, fetchUserRecipes,
} from '../../actions/userActions';

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.loggedIn,
  authLoading: state.user.loading,
  loggedInUser: state.user.user,
  token: state.user.token,
  diets: state.resources.diets,
  ingredients: state.resources.ingredients,
});

const mapDispatchToProps = (dispatch) => ({
  onLogin: async (user, getTokenSilently, ingredients, diets) => {
    const token = await getTokenSilently();
    if (token) {
      const data = { user, token };
      dispatch(userLogin(data));
      dispatch(fetchUserPreferences(token, ingredients, diets));
      dispatch(fetchUserRecipes(token));
    }
  },
  onLogout: () => dispatch(userLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
