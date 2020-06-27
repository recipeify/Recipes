import React from 'react';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import RecipeList from '../RecipeList';
import MainPageSidebar from '../Sidebar/MainPageSidebar';
import Navigation from '../Navigation';
import FreeTextSearch from '../Sidebar/FreeTextSearch/FreeTextSearch';

const { Header, Sider } = Layout;

class MainPage extends React.Component {
  async componentDidMount() {
    // nothing
  }

  render() {
    return (
      <>
        <Layout style={{ height: '100%' }}>
          <Header id="header">
            <Navigation siteMode="explore" />
          </Header>
          <Layout>
            <Sider theme="light" id="sidebar" width={500} style={{ height: '100%' }}>
              <MainPageSidebar />
            </Sider>
            <Layout id="content" style={{ padding: '0 24px 24px' }}>
              <div>
                <FreeTextSearch />
              </div>
              <RecipeList siteMode="explore" />
            </Layout>
          </Layout>
        </Layout>
      </>
    );
  }
}

export default MainPage;
