import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Avatar } from 'antd';
import PreferenceSelect from './PreferenceSelect';
import { selectVariants } from './PreferenceSelect/PreferenceSelect';
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
      token,
    } = this.props;
    getRecipesByFilters(
      token,
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
      token,
    } = this.props;
    getRecipesByFilters(
      token,
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
    const { siteMode, user } = this.props;
    const exploreSidebar = (
      <div className="sidebar">
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <FreeTextSearch />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <PreferenceSelect variant={selectVariants.INCLUDE_INGREDIENTS} />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <PreferenceSelect variant={selectVariants.EXCLUDE_INGREDIENTS} />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <PreferenceSelect variant={selectVariants.DIET} openDropdownOnClick />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <PreferenceSelect variant={selectVariants.DISH_TYPE} openDropdownOnClick />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <PreferenceSelect variant={selectVariants.CUISINE} openDropdownOnClick />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21}>
            <TimeSlider />
          </Col>
        </Row>
      </div>
    );

    const userPageSiderbar = (
      <div className="sidebar">
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21} style={{ textAlign: 'center' }}>
            <Avatar src={user.picture} className="avatar" />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21} style={{ textAlign: 'center' }}>
            <h1>{user.name}</h1>
          </Col>
        </Row>

      </div>
    );

    return siteMode === 'explore' ? exploreSidebar : userPageSiderbar;
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
  token: PropTypes.string,
  siteMode: PropTypes.string.isRequired,
  user: PropTypes.shape({
    picture: PropTypes.string,
    name: PropTypes.string,
  }),
};

Sidebar.defaultProps = {
  freeText: '',
  diet: [],
  dishType: [],
  cuisine: [],
  toCookTime: 600,
  fromCookTime: 0,
  token: undefined,
  user: {},
};

export default Sidebar;
