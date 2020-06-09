import { connect } from 'react-redux';
import Navigation from './Navigation';
import { userLogin, userLogout, fetchUserRecipes } from '../../actions/userActions';
import { switchToMyRecipes, switchToExplore } from '../../actions/modeActions';

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.loggedIn,
  loggedInUser: state.user.user,
  siteMode: state.mode.mode,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  onLogin: async (user, getTokenSilently) => {
    const token = await getTokenSilently();
    const data = { user, token };
    dispatch(userLogin(data));
  },
  onLogout: () => dispatch(userLogout()),
  goToMyRecipes: (token) => {
    dispatch(fetchUserRecipes(token));
    dispatch(switchToMyRecipes());
  },
  goToExplore: () => dispatch(switchToExplore()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
