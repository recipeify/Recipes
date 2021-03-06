import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  Select, Row, Col,
} from 'antd';
import PreferenceTagGroup from './PreferenceTagGroup';

const { Option } = Select;

export const selectVariants = {
  INCLUDE_INGREDIENTS: 'INCLUDE_INGREDIENTS',
  EXCLUDE_INGREDIENTS: 'EXCLUDE_INGREDIENTS',
  DIET: 'DIET',
  CUISINE: 'CUISINE',
  DISH_TYPE: 'DISH_TYPE',
  PERSONAL_EXCLUDES: 'PERSONAL_EXCLUDES',
  PERSONAL_DIET: 'PERSONAL_DIET',
};

const selectConfig = {
  [selectVariants.INCLUDE_INGREDIENTS]: {
    title: 'Add ingredient',
    color: 'green',
  },
  [selectVariants.EXCLUDE_INGREDIENTS]: {
    title: 'Exclude Ingredient',
    color: 'volcano',
  },
  [selectVariants.DIET]: {
    title: 'Dietary preferences',
  },
  [selectVariants.CUISINE]: {
    title: 'Search recipes by cuisine',
  },
  [selectVariants.DISH_TYPE]: {
    title: 'Search recipes by dish type',
  },
  [selectVariants.PERSONAL_EXCLUDES]: {
    title: 'Ingredient blacklist',
  },
  [selectVariants.PERSONAL_DIET]: {
    title: 'Dietary preferences',
  },
};

class PreferenceSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: undefined,
    };
  }

  componentDidUpdate(prevProps) {
    const { placeholder: prevPlaceholder } = prevProps;
    const { placeholder } = this.props;
    if (placeholder && !prevPlaceholder) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ placeholder });
    }
  }

  onEnterPreference(value) {
    const { addPreference } = this.props;
    const { data } = this.state;
    const option = [...data.filter((item) => item.key === value)];
    if (option.length === 0) {
      addPreference(value);
      this.setState({ value: undefined, data: [] });
    }
    if (option[0]) {
      addPreference(option[0]);
      this.setState({ value: null, data: [] });
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
      this.setState({ data: dataset });
    }
  }

  render() {
    const {
      variant, appliedPreferenceList, removePreference,
    } = this.props;
    const { data, value, placeholder } = this.state;
    const options = data.map((item) => (
      <Option key={item.key} value={item.key}>{item.key}</Option>
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
          <Col span={24} id={`dropdown-${variant}`} style={{ position: 'relative', overflow: 'visible' }}>
            <Select
              className="search-box"
              showSearch
              allowClear
              dropdownAlign={{
                overflow: { adjustY: false, adjustX: false },
              }}
              onFocus={() => this.handleClick()}
              onBlur={() => this.setState({ value: undefined })}
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
              placeholder={placeholder}
              dropdownStyle={{ overflow: 'visible', position: 'relative' }}
              getPopupContainer={() => document.getElementById(`dropdown-${variant}`)}
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
            color={get(selectConfig, `${variant}.color`, '')}
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
  placeholder: PropTypes.string.isRequired,
};

PreferenceSelect.defaultProps = {
  openDropdownOnClick: false,
  dataset: [],
};

export default PreferenceSelect;
