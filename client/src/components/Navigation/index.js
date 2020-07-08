import { connect } from 'react-redux';
import Navigation from './Navigation';

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.loggedIn,
  loggedInUser: state.user.user,
  token: state.user.token,
  diets: state.resources.diets,
  ingredients: state.resources.ingredients,
});

export default connect(mapStateToProps, null)(Navigation);
