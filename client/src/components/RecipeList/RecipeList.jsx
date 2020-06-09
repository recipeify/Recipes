import React from 'react';
import PropTypes from 'prop-types';
import { Gallery, GalleryItem } from '@patternfly/react-core';
import RecipeCard from './components/RecipeCard';
import spinner from '../../assets/Spin-1s-300px-transparent.gif';

class RecipeList extends React.Component {
  componentDidMount() {
    // nothing
  }

  render() {
    const { error, loading, recipes } = this.props;

    if (error) {
      return (
        <div>
          Error!
          {error.message}
        </div>
      );
    }

    if (loading) {
      return (
        <div className="recipe-list-placeholders">
          <img src={spinner} alt="" />
        </div>
      );
    }

    return (
      <Gallery
        id="recipe-list-grid"
      >
        {
          recipes.map((recipe) => (
            <GalleryItem key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </GalleryItem>
          ))
        }
      </Gallery>
    );
  }
}

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

RecipeList.defaultProps = {
  error: null,
};

export default RecipeList;
