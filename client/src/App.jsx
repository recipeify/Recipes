import React from 'react';
// import {
//   Page, PageHeader, PageSidebar, PageSection, Brand,
// } from '@patternfly/react-core';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import RecipeList from './components/RecipeList';
import Sidebar from './components/Sidebar';
import logo from './assets/cake-pop.svg';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class App extends React.Component {
  async componentDidMount() {
    // nothing
  }

  render() {
    const logoProps = {
      href: '/',
    };

    // const brand = <Brand src={logo} alt="Recipeify" />;
    // const Header = (
    //   <PageHeader
    //     logo={brand}
    //     logoProps={logoProps}
    //     toolbar="Toolbar"
    //     avatar=" | Avatar"
    //     isNavOpen
    //   />
    // );
    // const sidebarComponent = <Sidebar />;
    // const sidebar = <PageSidebar nav={sidebarComponent} isNavOpen theme="light" />;

    return (
      // <Page header={Header} sidebar={sidebar}>
      //   <PageSection>
      //     Recipes
      //   </PageSection>
      //   <PageSection
      //     isFilled
      //   >
      //     <RecipeList />
      //   </PageSection>
      // </Page>
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">nav 1</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={200} theme="light" className="sidebar">
            <Sidebar />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <RecipeList />
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default App;
