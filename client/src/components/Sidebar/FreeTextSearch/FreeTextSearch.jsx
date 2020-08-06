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
    const { currentValue } = this.props;
    return (
      <div className="search-box-wrapper">
        <Row gutter={16}>
          <Col span={24}>
            <Search
              className="free-text-search"
              defaultValue={currentValue || undefined}
              placeholder="What do you feel like cooking?"
              onSearch={(value) => this.onSearch(value)}
              allowClear
              autoFocus
              size="large"
              style={{ marginTop: '20px' }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

FreeTextSearch.propTypes = {
  addFreeText: PropTypes.func.isRequired,
  currentValue: PropTypes.string.isRequired,
};

export default FreeTextSearch;
