import { connect } from 'react-redux';
import FreeTextSearch from './FreeTextSearch';
import { addFreeText } from '../../../actions/searchActions';

const mapDispatchToProps = (dispatch) => ({
  addFreeText: (term) => dispatch(addFreeText(term)),
  clearFreeText: () => dispatch(addFreeText('')),
});

const mapStateToProps = (state) => ({
  currentValue: state.filters.freeText,
});

export default connect(mapStateToProps, mapDispatchToProps)(FreeTextSearch);
