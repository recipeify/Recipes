import React from 'react';
import PropTypes from 'prop-types';
import RecipeCarousel from '../RecipeCarousel';

class ExplorePage extends React.Component {
  componentDidUpdate() {
    const {
      getExplore, token, authLoading, explore, explorePending,
    } = this.props;
    if (!authLoading && explore.length === 0 && !explorePending) {
      const date = new Date().toString();
      getExplore(token, date);
    }
  }

  render() {
    const { explore } = this.props;
    if (explore.length === 0) {
      return (
        <div>loading</div>
      );
    }

    return (
      <div>
        {
           explore.filter((box) => (box.recipes.length > 7))
             .map((box) => (<RecipeCarousel recipes={box.recipes} title={box.name} />))
        }
      </div>
    );
  }
}

ExplorePage.propTypes = {
  getExplore: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  explore: PropTypes.arrayOf(PropTypes.object).isRequired,
  authLoading: PropTypes.bool.isRequired,
  explorePending: PropTypes.bool.isRequired,
};

export default ExplorePage;
