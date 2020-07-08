import { connect } from 'react-redux';
import MainPage from './MainPage';

const mapStateToProps = (state) => ({
  filtersApplied: state.filters.filtersApplied,
  authLoading: state.user.pending,
  explore: state.explore.explore,
});

export default connect(mapStateToProps, null)(MainPage);
