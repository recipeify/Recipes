import { connect } from 'react-redux';
import Navigation from './Navigation';
import { userLogin, userLogout } from '../../actions/userActions';

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.loggedIn,
  loggedInUser: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  onLogin: async (user, getTokenSilently) => {
    const token = await getTokenSilently();
    const data = { user, token };
    dispatch(userLogin(data));
  },
  onLogout: () => dispatch(userLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
