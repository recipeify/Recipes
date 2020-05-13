import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';

const { Meta } = Card;

const openRecipe = (link) => {
  window.open(link, 'noopener noreferrer');
};

const RecipeCard = (props) => {
  const { recipe } = props;
  const { title, link, image: imageURL } = recipe;
  return (
    <Card
      className="recipe-card"
      onClick={() => openRecipe(link)}
      hoverable
      cover={(
        <img
          className="recipe-image"
          src={imageURL}
          alt={title}
        />
      )}
    >
      <Meta
        className="recipe-card-meta"
        title={title}
      />
    </Card>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};

export default RecipeCard;
