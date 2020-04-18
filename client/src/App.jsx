import React from 'react';
import {
  Page, PageHeader, PageSidebar, PageSection, Brand,
} from '@patternfly/react-core';

import RecipeList from './components/RecipeList';
import Sidebar from './components/Sidebar/Sidebar';
import logo from './assets/cake-pop.svg';

class App extends React.Component {
  async componentDidMount() {
    // nothing
  }

  render() {
    const logoProps = {
      href: '/',
    };

    const brand = <Brand src={logo} alt="Recipeify" />;
    const Header = (
      <PageHeader
        logo={brand}
        logoProps={logoProps}
        toolbar="Toolbar"
        avatar=" | Avatar"
        isNavOpen
      />
    );
    const sidebarComponent = <Sidebar />;
    const sidebar = <PageSidebar nav={sidebarComponent} isNavOpen theme="light" />;

    return (
      <Page header={Header} sidebar={sidebar}>
        <PageSection
          isFilled
        >
          Hello World
        </PageSection>
        <PageSection>
          <RecipeList />
        </PageSection>
      </Page>
    );
  }
}

export default App;
