import { connect } from 'react-redux';
import FreeTextSearch from './FreeTextSearch';
import { addFreeText } from '../../../actions/searchActions';

const mapDispatchToProps = (dispatch) => ({
  addFreeText: (term) => dispatch(addFreeText(term)),
  clearFreeText: () => dispatch(addFreeText('')),
});

export default connect(null, mapDispatchToProps)(FreeTextSearch);
