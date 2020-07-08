import { connect } from 'react-redux';
import { fetchExplore } from '../../actions/exploreActions';
import ExplorePage from './ExplorePage';

const mapStateToProps = (state) => ({
  authLoading: state.user.pending,
  token: state.user.token,
  explore: state.explore.explore,
  popular: state.explore.popular,
  personal: state.explore.personal,
  explorePending: state.explore.loading,
  exploreError: state.explore.error,
});

const mapDispatchToProps = (dispatch) => ({
  getExplore: (token, date) => dispatch(fetchExplore(token, date)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExplorePage);
