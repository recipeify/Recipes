import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import MainPage from './components/MainPage/MainPage';

export const history = createBrowserHistory();

const App = () => (
  <BrowserRouter>
    <>
      <Route path="/" exact component={MainPage} />
      {/* <Route path="/" exact component={RecipeBook} /> */}
    </>
  </BrowserRouter>
);


export default App;
