import { connect } from 'react-redux';
import {
  addTimeRange, removeTimeRange,
} from '../../../actions/searchActions';
import TimeSlider from './TimeSlider';

const mapDispatchToProps = (dispatch) => ({
  setTimeRange: (value) => dispatch(addTimeRange([value[0] * 1.5, value[1] * 1.5])),
  clearTimeRange: () => dispatch(removeTimeRange()),
});

export default connect(null, mapDispatchToProps)(TimeSlider);
