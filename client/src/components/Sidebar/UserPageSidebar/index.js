import { connect } from 'react-redux';
import { editUserPreferences } from '../../../actions/userActions';
import { fetchResources } from '../../../actions/resourceActions';
import UserPageSiderbar from './UserPageSidebar';

const mapStateToProps = (state) => ({
  token: state.user.token,
  user: state.user.user,
  blacklist: state.user.preferences.blacklist,
  diet: state.user.preferences.diet,
});

const mapDispatchToProps = (dispatch) => ({
  updateUserPreferences: (token, blacklist, diet) => dispatch(editUserPreferences(
    token, blacklist, diet,
  )),
  getResources: () => dispatch(
    fetchResources(),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPageSiderbar);
