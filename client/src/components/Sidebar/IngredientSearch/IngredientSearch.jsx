import React from 'react';
import PropTypes from 'prop-types';
import { FaRegPlusSquare } from 'react-icons/fa';
import {
  Button,
  InputGroup,
  TextInput,
  Bullseye,
  Stack,
  StackItem,
  ChipGroup,
  Chip,
} from '@patternfly/react-core';
import { getRandomID } from '../../../common/helpers';

class IngredientSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: '',
    };
  }

  onEnterIngredient() {
    const { addIngredient } = this.props;
    const { currentValue } = this.state;
    if (currentValue !== '') {
      addIngredient(currentValue);
      this.setState({ currentValue: '' });
    }
  }

  render() {
    const { ingredientList, include, removeIngredient } = this.props;
    const { currentValue } = this.state;
    return (
      <Stack gutter="sm">
        <StackItem key="search1">
          <h1>{`Ingredients to ${include ? 'include' : 'exclude'}`}</h1>
          <InputGroup>
            <TextInput
              name="search-by-ingredient"
              id="search-by-ingredient"
              type="search"
              aria-label="search-by-ingredient"
              value={currentValue}
              onChange={(value) => { this.setState({ currentValue: value }); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { this.onEnterIngredient(); } }}
            />
            <Button
              id="ingredient-search-button"
              variant="control"
              aria-label="ingredient-search-button"
              onClick={() => this.onEnterIngredient()}
            >
              <Bullseye>
                <FaRegPlusSquare />
              </Bullseye>
            </Button>
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
  addIngredient: PropTypes.func.isRequired,
  removeIngredient: PropTypes.func.isRequired,
};

IngredientSearch.defaultProps = {
  include: false,
};

export default IngredientSearch;
