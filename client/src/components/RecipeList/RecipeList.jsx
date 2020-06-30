import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import RecipeCard from './components/RecipeCard';

class RecipeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from: 0,
    };
  }

  next() {
    const { from } = this.state;
    const {
      scrollRecipes,
      freeText,
      includeTerms,
      excludeTerms,
      toCookTime,
      fromCookTime,
      diet,
      dishType,
      cuisine,
      token,
    } = this.props;
    scrollRecipes(
      token,
      freeText,
      includeTerms,
      excludeTerms,
      diet,
      dishType,
      cuisine,
      toCookTime,
      fromCookTime,
      from + 30,
      30,
      token,
    );
    this.setState({ from: from + 30 });
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
          <picture>
            <source srcSet="../../assets/Spin-1s-300px-transparent.webp" type="image/webp" />
            <img src="../../assets/Spin-1s-300px-transparent.gif" alt="" />
          </picture>
        </div>
      );
    }

    return (
      <InfiniteScroll
        dataLength={recipes.length}
        next={() => this.next()}
        hasMore
      >
        <div
          id="recipe-list-grid"
        >
          {
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
          }
        </div>
      </InfiniteScroll>
    );
  }
}

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  scrollRecipes: PropTypes.func.isRequired,
  freeText: PropTypes.string,
  includeTerms: PropTypes.arrayOf(PropTypes.object).isRequired,
  excludeTerms: PropTypes.arrayOf(PropTypes.object).isRequired,
  diet: PropTypes.arrayOf(PropTypes.object),
  dishType: PropTypes.arrayOf(PropTypes.object),
  cuisine: PropTypes.arrayOf(PropTypes.object),
  toCookTime: PropTypes.number,
  fromCookTime: PropTypes.number,
  token: PropTypes.string,
};

RecipeList.defaultProps = {
  error: null,
  freeText: '',
  diet: [],
  dishType: [],
  cuisine: [],
  toCookTime: 600,
  fromCookTime: 0,
  token: '',
};

export default RecipeList;
