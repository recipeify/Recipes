import { connect } from 'react-redux';
import Navigation from './Navigation';
import {
  userLogin, userLogout, fetchUserRecipes, fetchUserPreferences,
} from '../../actions/userActions';

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.loggedIn,
  authLoading: state.user.loading,
  loggedInUser: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  onLogin: async (user, getTokenSilently) => {
    const token = await getTokenSilently();
    const data = { user, token };
    dispatch(userLogin(data));
    dispatch(fetchUserRecipes(token));
    dispatch(fetchUserPreferences(token));
  },
  onLogout: () => dispatch(userLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
