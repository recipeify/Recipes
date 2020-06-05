import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Input,
} from 'antd';

const { Search } = Input;

class FreeTextSearch extends React.Component {
  onSearch(term) {
    const { addFreeText } = this.props;
    addFreeText(term);
  }

  render() {
    return (
      <>
        <Row>
          <Col span={24}>
            <h1
              className="search-box-label"
            >
              Search for your next meal
            </h1>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Search
              placeholder="What do you feel like cooking?"
              onSearch={(value) => this.onSearch(value)}
              allowClear
            />
          </Col>
        </Row>
      </>
    );
  }
}

FreeTextSearch.propTypes = {
  addFreeText: PropTypes.func.isRequired,
};

export default FreeTextSearch;
