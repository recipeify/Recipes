import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { useAuth0 } from '../react-auth0-spa';
import GA from '../common/GoogleAnalytics';
import MainPage from '../components/MainPage';
import RecipeBook from '../components/RecipeBook';
import PrivateRoute from '../PrivateRoute';

export const history = createBrowserHistory();

const App = (props) => {
  const {
    isAuthenticated, loading, user, getTokenSilently,
  } = useAuth0();

  useEffect(() => {
    const {
      isLoggedIn,
      onLogout,
      onLogin,
      diets,
      ingredients,
      authLoading,
      setAuthLoading,
    } = props;
    if (loading !== authLoading) {
      setAuthLoading(loading);
    }
    if (!loading && !isLoggedIn && isAuthenticated && user) {
      onLogin(user, getTokenSilently, ingredients, diets);
    }
    if (!loading && isLoggedIn && !isAuthenticated) {
      onLogout(user);
    }
  });

  return (
    <BrowserRouter>
      { GA.init() && <GA.RouteTracker /> }
      <Switch>
        <Route path="/" exact component={MainPage} />
        <PrivateRoute path="/myrecipes" component={RecipeBook} />
      </Switch>
    </BrowserRouter>
  );
};


App.propTypes = {
  loggedInUser: PropTypes.shape({
    name: PropTypes.string,
    picture: PropTypes.string,
  }).isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.object),
  diets: PropTypes.arrayOf(PropTypes.object),
  authLoading: PropTypes.bool.isRequired,
  setAuthLoading: PropTypes.func.isRequired,
};

App.defaultProps = {
  diets: [],
  ingredients: [],
};

export default App;
