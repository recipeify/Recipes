import React from 'react';
import PropTypes from 'prop-types';
import '@patternfly/pfe-autocomplete';
import {
  InputGroup,
  Stack,
  StackItem,
  ChipGroup,
  Chip,
} from '@patternfly/react-core';
import { getRandomID } from '../../../common/helpers';

class IngredientSearch extends React.Component {
  constructor(props) {
    super(props);
    this.autocompeleteRef = React.createRef();
  }

  componentDidMount() {
    this.autocompeleteRef.current.autocompleteRequest = (params, callback) => {
      const { ingredientDataset } = this.props;
      this.autocompeleteRef.current.setAttribute('loading', '');
      const ret = ingredientDataset.filter(
        (item) => item.indexOf(params.query.toLowerCase()) > -1,
      ).slice(0, 10);
      callback(ret);
      this.autocompeleteRef.current.removeAttribute('loading');
    };

    this.autocompeleteRef.current.addEventListener('pfe-search-event', (e) => {
      this.onEnterIngredient(e.detail.searchValue);
      this.autocompeleteRef.current.initValue = '';
    });
  }

  onEnterIngredient(ingredient) {
    const { addIngredient } = this.props;
    if (ingredient !== '') {
      addIngredient(ingredient);
    }
  }

  render() {
    const { ingredientList, include, removeIngredient } = this.props;
    return (
      <Stack gutter="sm">
        <StackItem key="search1">
          <h1>{`Ingredients to ${include ? 'include' : 'exclude'}`}</h1>
          <InputGroup>
            <pfe-autocomplete
              ref={this.autocompeleteRef}
              debounce="500"
            >
              <input placeholder="Enter Your Search Term" />
            </pfe-autocomplete>
          </InputGroup>
        </StackItem>
        <StackItem key="chips1">
          <ChipGroup
            numChips={10}
          >
            {ingredientList.map((ingredient) => (
              <Chip
                className={`${include ? 'include' : 'exclude'}-ingredient-chip`}
                key={`${include ? 'include' : 'exclude'}${getRandomID()}`}
                onClick={() => removeIngredient(ingredient)}
              >
                {ingredient}
              </Chip>
            ))}
          </ChipGroup>
        </StackItem>
      </Stack>
    );
  }
}

IngredientSearch.propTypes = {
  include: PropTypes.bool,
  ingredientList: PropTypes.arrayOf(PropTypes.string).isRequired,
  ingredientDataset: PropTypes.arrayOf(PropTypes.string).isRequired,
  addIngredient: PropTypes.func.isRequired,
  removeIngredient: PropTypes.func.isRequired,
};

IngredientSearch.defaultProps = {
  include: false,
};

export default IngredientSearch;
