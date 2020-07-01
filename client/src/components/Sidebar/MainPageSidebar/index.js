import { connect } from 'react-redux';
import { fetchResources } from '../../../actions/resourceActions';
import MainPageSidebar from './MainPageSidebar';

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  getResources: () => dispatch(
    fetchResources(),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPageSidebar);
