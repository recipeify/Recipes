import React from 'react';
import PropTypes from 'prop-types';

import {
  Select, Row, Col,
} from 'antd';
import IngredientTags from './IngredientTags';

const { Option } = Select;

class IngredientSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      data: [],
      value: '',
    };
  }

  onEnterIngredient(value) {
    const { addIngredient } = this.props;
    if (value !== '') {
      addIngredient(value);
      this.setState({ value: '', data: [] });
    }
  }

  handleChange(value) {
    const { ingredientDataset } = this.props;
    this.setState({ value });
    const results = ingredientDataset.filter((ingredient) => (
      ingredient.value.toUpperCase().indexOf(value.toUpperCase()) !== -1
    ));
    this.setState({ data: results });
  }

  render() {
    const {
      include, ingredientList, removeIngredient,
    } = this.props;
    const { data, value } = this.state;
    const options = data.map((ingredient) => (
      <Option key={ingredient.value}>{ingredient.value}</Option>
    ));
    return (
      <>
        <Row gutter={[0, 20]}>
          <Col span={24}>
            <h1
              className="search-box-label"
            >
              {`Ingredients to ${include ? 'include' : 'exclude'}`}
            </h1>
            <Select
              className="search-box"
              showSearch
              allowClear
              size="middle"
              value={value}
              placeholder="Enter your search term"
              showArrow={false}
              filterOption={false}
              onSelect={(inputValue) => this.onEnterIngredient(inputValue)}
              onSearch={(inputValue) => this.handleChange(inputValue)}
              notFoundContent={null}
              onKeyDown={(e) => {
                if (e.keyCode === 13 && data.length === 0) {
                  this.onEnterIngredient(value);
                }
              }}
            >
              {options}
            </Select>
          </Col>
        </Row>
        <Row gutter={[0, 20]}>
          <IngredientTags
            ingredientList={ingredientList}
            onClose={removeIngredient}
            include={include}
          />
        </Row>
      </>
    );
  }
}

IngredientSearch.propTypes = {
  include: PropTypes.bool,
  ingredientList: PropTypes.arrayOf(PropTypes.string).isRequired,
  ingredientDataset: PropTypes.arrayOf(PropTypes.object).isRequired,
  addIngredient: PropTypes.func.isRequired,
  removeIngredient: PropTypes.func.isRequired,
};

IngredientSearch.defaultProps = {
  include: false,
};

export default IngredientSearch;
