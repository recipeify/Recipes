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
      <Row gutter={16}>
        <Col span={24}>
          <Search
            placeholder="What do you feel like cooking?"
            onSearch={(value) => this.onSearch(value)}
            allowClear
            size="large"
            style={{ marginTop: '20px' }}
          />
        </Col>
      </Row>
    );
  }
}

FreeTextSearch.propTypes = {
  addFreeText: PropTypes.func.isRequired,
};

export default FreeTextSearch;
