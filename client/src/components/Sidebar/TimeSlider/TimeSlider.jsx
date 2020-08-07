import React from 'react';
import PropTypes from 'prop-types';
import {
  Slider,
  Row,
  Col,
  Switch,
  Tag,
} from 'antd';


class TimeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      timeRange: [0, 10],
    };
  }

  onChangeTime(value) {
    this.setState({ timeRange: value });
    const { setTimeRange } = this.props;
    setTimeRange(value);
  }

  onChangeSwitch(checked) {
    this.setState({ disabled: !checked });
    if (!checked) {
      const { clearTimeRange } = this.props;
      clearTimeRange();
    } else {
      const { setTimeRange } = this.props;
      const { timeRange } = this.state;
      setTimeRange(timeRange);
    }
  }

  getTag() {
    const { timeRange } = this.state;
    return `${timeRange[0] * 1.5} to ${timeRange[1] * 1.5} minutes`;
  }

  render() {
    const { disabled, timeRange } = this.state;
    const marks = {
      0: '15 >',
      100: '150',
    };
    return (

      <>
        <Row>
          <Col span={18}>
            <h1
              className="search-box-label"
            >
              Cooking time limit
            </h1>
          </Col>
          <Col span={5}>
            <Switch
              id="time-switch"
              unCheckedChildren="Any"
              onChange={(checked) => this.onChangeSwitch(checked)}
            />
          </Col>
        </Row>
        {
          !disabled && (
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Slider
                className="time-slider"
                range
                marks={marks}
                included={false}
                defaultValue={timeRange}
                disabled={disabled}
                onChange={(val) => this.onChangeTime(val)}
                step={10}
                tipFormatter={(val) => `${val * 1.5}`}
              />
            </Col>
          </Row>
          )
        }
        {
          !disabled && timeRange !== undefined && (
            <Row gutter={[0, 20]}>
              <Tag>{this.getTag()}</Tag>
            </Row>
          )
        }
      </>
    );
  }
}

TimeSlider.propTypes = {
  setTimeRange: PropTypes.func.isRequired,
  clearTimeRange: PropTypes.func.isRequired,
};

export default TimeSlider;
