import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Button } from 'antd';
import { getRandomID } from '../../../common/helpers';


class IngredientTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMore: false,
    };
  }

  render() {
    const { ingredientList, include, onClose } = this.props;
    const viewMoreText = `${ingredientList.length - 10} more`;
    const { viewMore } = this.state;
    return (
      <div>
        {ingredientList.map((ingredient, index) => (
          <Tag
            className="ingredient-chip"
            key={`${include ? 'include' : 'exclude'}${getRandomID()}`}
            closable
            onClose={() => onClose(ingredient)}
            color={include ? 'green' : 'red'}
            visible={index <= 10 || viewMore}
          >
            <span>
              {ingredient}
            </span>
          </Tag>
        ))}
        {ingredientList.length > 10 && (
          <Button
            className="ingredient-tag-button"
            key={`${include ? 'include' : 'exclude'}${getRandomID()}`}
            onClick={() => {
              this.setState({ viewMore: !viewMore });
            }}
            size="small"
          >
            <span>
              {!viewMore ? viewMoreText : 'Show less'}
            </span>
          </Button>
        )}
      </div>
    );
  }
}

IngredientTags.propTypes = {
  ingredientList: PropTypes.arrayOf(PropTypes.string).isRequired,
  include: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default IngredientTags;
