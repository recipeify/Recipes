import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Tag } from 'antd';
import { getRandomID } from '../../../common/helpers';

class IngredientSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      inputValue: '',
    };
  }

  // componentDidMount() {
  //   this.autocompeleteRef.current.autocompleteRequest = (params, callback) => {
  //     const { ingredientDataset } = this.props;
  //     this.autocompeleteRef.current.setAttribute('loading', '');
  //     const ret = ingredientDataset.filter(
  //       (item) => item.indexOf(params.query.toLowerCase()) > -1,
  //     ).slice(0, 10);
  //     callback(ret);
  //     this.autocompeleteRef.current.removeAttribute('loading');
  //   };

  //   this.autocompeleteRef.current.addEventListener('pfe-search-event', (e) => {
  //     this.onEnterIngredient(e.detail.searchValue);
  //     this.autocompeleteRef.current.initValue = '';
  //   });
  // }


  onEnterIngredient(ingredient) {
    const { addIngredient } = this.props;
    if (ingredient !== '') {
      addIngredient(ingredient);
    }
  }

  render() {
    const {
      include, ingredientList, removeIngredient, ingredientDataset,
    } = this.props;
    const { open, inputValue } = this.state;
    return (
      <div>
        <h1>{`Ingredients to ${include ? 'include' : 'exclude'}`}</h1>
        <AutoComplete
          style={{ width: 200 }}
          options={ingredientDataset}
          placeholder="Enter your search term"
          filterOption={
            (value, option) => (
              option.value.toUpperCase().indexOf(value.toUpperCase()) !== -1
            )
          }
          value={inputValue}
          onSelect={(value) => {
            this.onEnterIngredient(value);
            this.setState({ open: false, inputValue: '' });
          }}
          onChange={(value) => {
            this.setState({ inputValue: value });
            if (value !== '') {
              this.setState({ open: true });
            } else {
              this.setState({ open: false });
            }
          }}
          open={open}
          onBlur={() => { this.setState({ open: false }); }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              this.onEnterIngredient(inputValue);
              this.setState({ open: false });
            }
          }}
        />
        {ingredientList.map((ingredient) => (
          <Tag
            className={`${include ? 'include' : 'exclude'}-ingredient-chip`}
            key={`${include ? 'include' : 'exclude'}${getRandomID()}`}
            closable
            onClose={() => removeIngredient(ingredient)}
          >
            <span>
              {ingredient}
            </span>
          </Tag>
        ))}
      </div>
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
