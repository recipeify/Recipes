import React from 'react';
import PropTypes from 'prop-types';
import { uniqBy } from 'lodash';
import RecipeCarousel from '../RecipeCarousel';

class ExplorePage extends React.Component {
  componentDidMount() {
    const {
      getExplore, token, authLoading, explore, explorePending,
    } = this.props;
    if (!authLoading && explore.length === 0 && !explorePending) {
      const date = new Date().toString();
      getExplore(token, date);
    }
  }

  render() {
    const { explore, popular, personal } = this.props;
    return (
      <>
        <div>
          <h1 className="explore-title">Recommended for you</h1>
          <RecipeCarousel
            key="personal"
            recipes={personal}
          />
        </div>
        <div>
          <h1 className="explore-title">Popular on Recipeify</h1>
          <RecipeCarousel
            key="popular"
            recipes={popular}
          />
        </div>
        <div>
          <h1 className="explore-title">Explore new recipes</h1>
          {
            uniqBy(explore.filter((box) => (box.recipes.length > 7)), 'name')
              .map((box) => (
                <RecipeCarousel
                  key={box.name}
                  recipes={box.recipes}
                  title={box.name}
                />
              ))
          }
        </div>
      </>
    );
  }
}

ExplorePage.propTypes = {
  getExplore: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  explore: PropTypes.arrayOf(PropTypes.object).isRequired,
  authLoading: PropTypes.bool.isRequired,
  explorePending: PropTypes.bool.isRequired,
  popular: PropTypes.arrayOf(PropTypes.object).isRequired,
  personal: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ExplorePage;
