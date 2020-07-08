import { connect } from 'react-redux';
import {
  authLoading, userLogin, userLogout, fetchUserPreferences, fetchUserRecipes,
} from '../actions/userActions';
import { fetchExplore } from '../actions/exploreActions';
import App from './App';

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.loggedIn,
  loggedInUser: state.user.user,
  token: state.user.token,
  diets: state.resources.diets,
  ingredients: state.resources.ingredients,
  explore: state.explore.explore,
  explorePending: state.explore.loading,
});

const mapDispatchToProps = (dispatch) => ({
  onUnauthedEntry: () => {
    const date = new Date().toString();
    dispatch(fetchExplore('', date));
  },
  onLogin: async (user, getTokenSilently, ingredients, diets) => {
    const token = await getTokenSilently();
    if (token) {
      const data = { user, token };
      await dispatch(userLogin(data));
      dispatch(fetchUserPreferences(token, ingredients, diets));
      dispatch(fetchUserRecipes(token));
      const date = new Date().toString();
      dispatch(fetchExplore(token, date));
    }
  },
  onLogout: () => dispatch(userLogout()),
  setAuthLoading: (b) => dispatch(authLoading(b)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
