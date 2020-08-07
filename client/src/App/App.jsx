import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { useAuth0 } from '../react-auth0-spa';
import GA from '../common/GoogleAnalytics';
import MainPage from '../components/MainPage';
import RecipeBook from '../components/RecipeBook';
import PrivateRoute from '../PrivateRoute';
import NotFound from '../components/NotFound';
import Privacy from '../components/Privacy';

export const history = createBrowserHistory();

const App = (props) => {
  const [firstEntryDone, markFirstEntryDone] = useState(false);

  const {
    isAuthenticated, loading, user, getTokenSilently,
  } = useAuth0();

  useEffect(() => {
    const {
      isLoggedIn,
      onLogout,
      onLogin,
      onUnauthedEntry,
      diets,
      ingredients,
      authLoading,
      setAuthLoading,
    } = props;
    if (loading !== authLoading) {
      setAuthLoading(loading);
    }
    if (!loading && !isLoggedIn && !isAuthenticated && !firstEntryDone) {
      onUnauthedEntry();
      markFirstEntryDone(true);
    }
    if (!loading && !isLoggedIn && isAuthenticated && user && !firstEntryDone) {
      onLogin(user, getTokenSilently, ingredients, diets);
      markFirstEntryDone(true);
    }
    if (!loading && isLoggedIn && !isAuthenticated) {
      onLogout(user);
      markFirstEntryDone(false);
    }
  });

  return (
    <BrowserRouter>
      { GA.init() && <GA.RouteTracker /> }
      <Switch>
        <Route path="/" exact component={MainPage} />
        <PrivateRoute path="/myrecipes" component={RecipeBook} />
        <Route component={NotFound} />
        <Route path="/privacy" component={Privacy} />
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
  authLoading: PropTypes.bool,
  setAuthLoading: PropTypes.func.isRequired,
  onUnauthedEntry: PropTypes.func.isRequired,
};

App.defaultProps = {
  diets: [],
  ingredients: [],
  authLoading: false,
};

export default App;
