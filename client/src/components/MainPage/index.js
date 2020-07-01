import { connect } from 'react-redux';
import MainPage from './MainPage';

const mapStateToProps = (state) => ({
  filtersApplied: state.filters.filtersApplied,
});

export default connect(mapStateToProps, null)(MainPage);
