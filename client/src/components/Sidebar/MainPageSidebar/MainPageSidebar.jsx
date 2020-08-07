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
  async componentDidMount() {
    const {
      getResources,
      dietsDataset,
      ingredientsDataset,
      getUserPreferences,
      token,
    } = this.props;
    if (dietsDataset.length === 0 || ingredientsDataset.length === 0) {
      getResources();
    }
    if (token) {
      getUserPreferences(token, ingredientsDataset, dietsDataset);
    }
  }

  componentDidUpdate(prevProps) {
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
    if (prevProps.token !== token) {
      return;
    }
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
    return (
      <div className="sidebar">
        <Collapse bordered={false} defaultActiveKey={['ingredients', 'moreFilters']} className="sidebar-collapse">
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
              <Col span={24}>
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
  user: PropTypes.shape({
    picture: PropTypes.string,
    name: PropTypes.string,
  }),
  ingredientsDataset: PropTypes.arrayOf(PropTypes.object),
  dietsDataset: PropTypes.arrayOf(PropTypes.object),
  getUserPreferences: PropTypes.func.isRequired,
};

MainPageSidebar.defaultProps = {
  freeText: '',
  diet: [],
  dishType: [],
  cuisine: [],
  toCookTime: 600,
  fromCookTime: 0,
  token: undefined,
  user: {},
  ingredientsDataset: [],
  dietsDataset: [],
};

export default MainPageSidebar;
