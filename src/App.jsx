import React from 'react';
import { Page, PageHeader, PageSidebar, PageSection } from '@patternfly/react-core';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNavOpen: true
    };
    this.onNavToggle = () => {
      this.setState({
        isNavOpen: !this.state.isNavOpen
      });
    };
  }

  render() {
    const { isNavOpen } = this.state;

    const logoProps = {
      href: 'https://patternfly.org',
      onClick: () => console.log('clicked logo'),
      target: '_blank'
    };
    const Header = (
      <PageHeader
        logo="Logo"
        logoProps={logoProps}
        toolbar="Toolbar"
        avatar=" | Avatar"
        showNavToggle
        isNavOpen={isNavOpen}
        onNavToggle={this.onNavToggle}
      />
    );
    const Sidebar = <PageSidebar nav="Navigation" isNavOpen={isNavOpen} theme="dark" />;

    return (
      <Page header={Header} sidebar={Sidebar}>
        <PageSection>Hello World</PageSection>
      </Page>
    );
  }
}

export default App;
