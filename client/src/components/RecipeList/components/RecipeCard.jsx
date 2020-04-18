import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardBody,
} from '@patternfly/react-core';

const openRecipe = (link) => {
  window.open(link, 'noopener noreferrer');
};

const RecipeCard = (props) => {
  const { recipe } = props;
  const { title, link, image: imageURL } = recipe;
  return (
    <Card
      onClick={() => openRecipe(link)}
      isHoverable
    >
      <CardHeader>
        {title}
      </CardHeader>
      <CardBody>
        <img
          className="recipe-image"
          src={imageURL}
          alt={title}
        />
      </CardBody>
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
