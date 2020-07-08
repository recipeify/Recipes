import { connect } from 'react-redux';
import { fetchExplore } from '../../actions/exploreActions';
import ExplorePage from './ExplorePage';

const mapStateToProps = (state) => {
  const greeting = state.explore.mealByTime.name;
  const firstName = state.user.user.given_name;
  let welcome = '';
  let tryRecipes = [];
  if (greeting) {
    [welcome, tryRecipes] = greeting.split('!');
    if (firstName) {
      welcome = `${welcome}, ${firstName}.`;
    } else {
      welcome = `${welcome}!`;
    }
  }
  return {
    isLoggedIn: state.user.loggedIn,
    authLoading: state.user.pending,
    token: state.user.token,
    explore: state.explore.explore,
    popular: state.explore.popular,
    personal: state.explore.personal,
    mealsByTime: state.explore.mealByTime.recipes || [],
    explorePending: state.explore.loading,
    exploreError: state.explore.error,
    welcome,
    tryRecipes,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getExplore: (token, date) => dispatch(fetchExplore(token, date)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExplorePage);
