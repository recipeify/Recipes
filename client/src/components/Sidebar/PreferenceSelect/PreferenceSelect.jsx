import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  Select, Row, Col,
} from 'antd';
import PreferenceTagGroup from './PreferenceTagGroup';

const { Option } = Select;

export const sidebarSelects = {
  INCLUDE_INGREDIENTS: 'INCLUDE_INGREDIENTS',
  EXCLUDE_INGREDIENTS: 'EXCLUDE_INGREDIENTS',
  DIET: 'DIET',
  CUISINE: 'CUISINE',
  DISH_TYPE: 'DISH_TYPE',
};

const selectConfig = {
  [sidebarSelects.INCLUDE_INGREDIENTS]: {
    title: 'Add ingredient to include',
    color: 'green',
  },
  [sidebarSelects.EXCLUDE_INGREDIENTS]: {
    title: 'Add ingredient to exclude',
    color: 'volcano',
  },
  [sidebarSelects.DIET]: {
    title: 'Dietary preferences',
    color: 'purple',
  },
  [sidebarSelects.CUISINE]: {
    title: 'Search recipes by cuisine',
    color: 'geekblue',
  },
  [sidebarSelects.DISH_TYPE]: {
    title: 'Search recipes by dish type',
    color: 'magenta',
  },
};

class PreferenceSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: '',
    };
  }

  onEnterPreference(value) {
    const { addPreference } = this.props;
    const { data } = this.state;
    const option = [...data.filter((item) => item.key === value)];
    if (option === 0 && value !== '') {
      addPreference(value);
      this.setState({ value: '', data: [] });
    }
    if (option[0]) {
      addPreference(option[0]);
      this.setState({ value: '', data: [] });
    }
  }

  handleChange(value) {
    const { dataset } = this.props;
    this.setState({ value });
    const results = dataset.filter((item) => (
      item.key.toUpperCase().indexOf(value.toUpperCase()) !== -1
    ));
    this.setState({ data: results });
  }

  handleClick() {
    const { dataset, openDropdownOnClick } = this.props;
    if (openDropdownOnClick) {
      console.log('hi');
      this.setState({ data: dataset });
    }
  }

  render() {
    const {
      variant, appliedPreferenceList, removePreference,
    } = this.props;

    const { data, value } = this.state;
    const options = data.map((item) => (
      <Option key={item.key}>{item.key}</Option>
    ));
    return (
      <>
        <Row>
          <Col span={24}>
            <h1
              className="search-box-label"
            >
              {get(selectConfig, `${variant}.title`)}
            </h1>
          </Col>
        </Row>
        <Row gutter={[0, 20]}>
          <Col span={24}>
            <Select
              className="search-box"
              showSearch
              allowClear
              onClick={() => this.handleClick()}
              value={value}
              showArrow={false}
              onSelect={(inputValue) => this.onEnterPreference(inputValue)}
              onSearch={(inputValue) => this.handleChange(inputValue)}
              onKeyDown={(e) => {
                if (e.keyCode === 13 && data.length === 0) {
                  this.onEnterPreference(value);
                }
              }}
              notFoundContent={null}
            >
              {options}
            </Select>
          </Col>
        </Row>
        <Row>
          <PreferenceTagGroup
            variant={variant}
            appliedPreferenceList={appliedPreferenceList}
            onClose={removePreference}
            color={get(selectConfig, `${variant}.color`) || null}
          />
        </Row>
      </>
    );
  }
}

PreferenceSelect.propTypes = {
  variant: PropTypes.string.isRequired,
  appliedPreferenceList: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataset: PropTypes.arrayOf(PropTypes.object),
  addPreference: PropTypes.func.isRequired,
  removePreference: PropTypes.func.isRequired,
  openDropdownOnClick: PropTypes.bool,
};

PreferenceSelect.defaultProps = {
  openDropdownOnClick: false,
  dataset: [],
};

export default PreferenceSelect;
