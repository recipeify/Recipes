import React from 'react';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import PropogateLoader from 'react-spinners/PropagateLoader';
import RecipeList from '../RecipeList';
import ExplorePage from '../Explore';
import MainPageSidebar from '../Sidebar/MainPageSidebar';
import Navigation from '../Navigation';
import FreeTextSearch from '../Sidebar/FreeTextSearch';

const { Header, Sider } = Layout;

const MainPage = (props) => {
  const { filtersApplied, explore } = props;
  if (explore.length === 0) {
    return (
      <div className="loading-screen">
        <PropogateLoader
          size={15}
          color="#ec7533"
        />
      </div>
    );
  }

  return (
    <>
      <Layout style={{ height: '100%' }}>
        <Header id="header">
          <Navigation siteMode="explore" />
        </Header>
        <Layout>
          <Sider theme="light" id="sidebar" width="18%" style={{ height: '100%' }}>
            <MainPageSidebar />
          </Sider>
          <Layout id="content" style={{ padding: '0 24px 24px' }}>
            <div>
              <FreeTextSearch />
            </div>
            { filtersApplied ? <RecipeList siteMode="explore" /> : <ExplorePage /> }
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

MainPage.propTypes = {
  filtersApplied: PropTypes.bool.isRequired,
  explore: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MainPage;
