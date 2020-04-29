import React from 'react';
import PropTypes from 'prop-types';
import { Stack, StackItem } from '@patternfly/react-core';
import IngredientSearch from './IngredientSearch';

class Sidebar extends React.Component {
  componentDidMount() {
    const { getRecipesByIngredients, includeTerms, excludeTerms } = this.props;
    getRecipesByIngredients(includeTerms, excludeTerms);
  }

  componentDidUpdate() {
    const { getRecipesByIngredients, includeTerms, excludeTerms } = this.props;
    getRecipesByIngredients(includeTerms, excludeTerms);
  }

  render() {
    return (
      <Stack
        gutter="sm"
      >
        <StackItem>
          <IngredientSearch include />
          <IngredientSearch include={false} />
        </StackItem>
      </Stack>
    );
  }
}

Sidebar.propTypes = {
  getRecipesByIngredients: PropTypes.func.isRequired,
  includeTerms: PropTypes.arrayOf(PropTypes.string).isRequired,
  excludeTerms: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Sidebar;
