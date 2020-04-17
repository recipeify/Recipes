import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchRecipesByIngredient } from '../actions/recipeActions';

class RecipeList extends React.Component {
  componentDidMount() {
    const { getRecipes } = this.props;
    getRecipes('brandy');
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
      return <div>Loading...</div>;
    }

    return (
      <ul>
        {recipes.map((recipe) => <li key={recipe.id}>{recipe.title}</li>)}
      </ul>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getRecipes: (term, from, size) => dispatch(fetchRecipesByIngredient(term, from, size)),
});

const mapStateToProps = (state) => ({
  recipes: state.recipes.items,
  loading: state.recipes.loading,
  error: state.recipes.error,
});

RecipeList.propTypes = {
  getRecipes: PropTypes.func.isRequired,
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

RecipeList.defaultProps = {
  error: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeList);
