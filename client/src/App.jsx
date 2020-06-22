import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import MainPage from './components/MainPage/MainPage';
import GA from './common/GoogleAnalytics';
import RecipeBook from './components/RecipeBook';
import PrivateRoute from './PrivateRoute';

export const history = createBrowserHistory();

const App = () => (
  <BrowserRouter>
    { GA.init() && <GA.RouteTracker /> }
    <Switch>
      <Route path="/" exact component={MainPage} />
      <PrivateRoute path="/myrecipes" component={RecipeBook} />
    </Switch>
  </BrowserRouter>
);

export default App;
