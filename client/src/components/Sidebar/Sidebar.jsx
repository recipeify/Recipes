import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'antd';
// import { Stack, StackItem } from '@patternfly/react-core';
import IngredientSearch from './IngredientSearch';



class Sidebar extends React.Component {
  componentDidMount() {
    const {
      getRecipesByIngredients,
      includeTerms,
      excludeTerms,
      getIngredientDataset,
    } = this.props;
    getRecipesByIngredients(includeTerms, excludeTerms);
    getIngredientDataset();
  }

  componentDidUpdate() {
    const { getRecipesByIngredients, includeTerms, excludeTerms } = this.props;
    getRecipesByIngredients(includeTerms, excludeTerms);
  }

  render() {
    return (
      <div>
        <Row>
          <IngredientSearch include />
        </Row>
        <Row>
          <IngredientSearch include={false} />
        </Row>
      </div>
    );
  }
}

Sidebar.propTypes = {
  getRecipesByIngredients: PropTypes.func.isRequired,
  getIngredientDataset: PropTypes.func.isRequired,
  includeTerms: PropTypes.arrayOf(PropTypes.string).isRequired,
  excludeTerms: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Sidebar;
