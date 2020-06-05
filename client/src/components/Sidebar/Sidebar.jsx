import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
// import { Stack, StackItem } from '@patternfly/react-core';
import PreferenceSelect from './PreferenceSelect';
import { sidebarSelects } from './PreferenceSelect/PreferenceSelect';
import TimeSlider from './TimeSlider';
import FreeTextSearch from './FreeTextSearch/index';

class Sidebar extends React.Component {
  componentDidMount() {
    const {
      getRecipesByFilters,
      freeText,
      includeTerms,
      excludeTerms,
      toCookTime,
      fromCookTime,
      diet,
      dishType,
      cuisine,
      getResources,
    } = this.props;
    getRecipesByFilters(
      freeText,
      includeTerms,
      excludeTerms,
      diet,
      dishType,
      cuisine,
      toCookTime,
      fromCookTime,
    );
    getResources();
  }

  componentDidUpdate() {
    const {
      getRecipesByFilters,
      freeText,
      includeTerms,
      excludeTerms,
      toCookTime,
      fromCookTime,
      diet,
      cuisine,
      dishType,
    } = this.props;
    getRecipesByFilters(
      freeText,
      includeTerms,
      excludeTerms,
      diet,
      dishType,
      cuisine,
      toCookTime,
      fromCookTime,
    );
  }

  render() {
    return (
      <div className="sidebar">
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <FreeTextSearch />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <PreferenceSelect variant={sidebarSelects.INCLUDE_INGREDIENTS} />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <PreferenceSelect variant={sidebarSelects.EXCLUDE_INGREDIENTS} />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <PreferenceSelect variant={sidebarSelects.DIET} openDropdownOnClick />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <PreferenceSelect variant={sidebarSelects.DISH_TYPE} openDropdownOnClick />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <PreferenceSelect variant={sidebarSelects.CUISINE} openDropdownOnClick />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <TimeSlider />
          </Col>
        </Row>
      </div>
    );
  }
}

Sidebar.propTypes = {
  getRecipesByFilters: PropTypes.func.isRequired,
  getResources: PropTypes.func.isRequired,
  freeText: PropTypes.string,
  includeTerms: PropTypes.arrayOf(PropTypes.object).isRequired,
  excludeTerms: PropTypes.arrayOf(PropTypes.object).isRequired,
  diet: PropTypes.arrayOf(PropTypes.object),
  dishType: PropTypes.arrayOf(PropTypes.object),
  cuisine: PropTypes.arrayOf(PropTypes.object),
  toCookTime: PropTypes.number,
  fromCookTime: PropTypes.number,
};

Sidebar.defaultProps = {
  freeText: '',
  diet: [],
  dishType: [],
  cuisine: [],
  toCookTime: 600,
  fromCookTime: 0,
};

export default Sidebar;
