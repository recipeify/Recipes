import React from 'react';
import {
  Page, PageHeader, PageSidebar, PageSection,
} from '@patternfly/react-core';

import RecipeList from './components/recipeList';

class App extends React.Component {
  async componentDidMount() {
    // nothing
  }

  render() {
    const logoProps = {
      href: 'https://patternfly.org',
      onClick: () => console.log('clicked logo'),
      target: '_blank',
    };
    const Header = (
      <PageHeader
        logo="Logo"
        logoProps={logoProps}
        toolbar="Toolbar"
        avatar=" | Avatar"
        isNavOpen
      />
    );
    const Sidebar = <PageSidebar nav="Navigation" isNavOpen theme="light" />;

    return (
      <Page header={Header} sidebar={Sidebar}>
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
