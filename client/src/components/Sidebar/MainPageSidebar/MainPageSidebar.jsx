import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Collapse,
} from 'antd';
import PreferenceSelect from '../PreferenceSelect';
import { selectVariants } from '../PreferenceSelect/PreferenceSelect';
import TimeSlider from '../TimeSlider';

const { Panel } = Collapse;

class MainPageSidebar extends React.Component {
  componentDidMount() {
    const {
      getResources,
    } = this.props;
    getResources();
  }

  render() {
    return (
      <div className="sidebar">
        <Collapse bordered={false} defaultActiveKey={['ingredients', 'moreFilters']}>
          <Panel header="Cook by ingredients" key="ingredients">
            <Row gutter={[16, 30]}>
              <Col span={23}>
                <PreferenceSelect variant={selectVariants.INCLUDE_INGREDIENTS} />
              </Col>
            </Row>
            <Row gutter={[16, 30]}>
              <Col span={23}>
                <PreferenceSelect variant={selectVariants.EXCLUDE_INGREDIENTS} />
              </Col>
            </Row>
          </Panel>
          <Panel header="Cook by preferences" key="moreFilters">
            <Row gutter={[16, 30]}>
              <Col span={23}>
                <PreferenceSelect variant={selectVariants.DIET} openDropdownOnClick />
              </Col>
            </Row>
            <Row gutter={[16, 30]}>
              <Col span={23}>
                <PreferenceSelect variant={selectVariants.DISH_TYPE} openDropdownOnClick />
              </Col>
            </Row>
            <Row gutter={[16, 30]}>
              <Col span={23}>
                <PreferenceSelect variant={selectVariants.CUISINE} openDropdownOnClick />
              </Col>
            </Row>
            <Row gutter={[16, 30]}>
              <Col span={23}>
                <TimeSlider />
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </div>
    );
  }
}

MainPageSidebar.propTypes = {
  getResources: PropTypes.func.isRequired,
  user: PropTypes.shape({
    picture: PropTypes.string,
    name: PropTypes.string,
  }),
};

MainPageSidebar.defaultProps = {
  user: {},
};

export default MainPageSidebar;
