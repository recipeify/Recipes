import React from 'react';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import RecipeList from '../RecipeList';
import ExplorePage from '../Explore';
import MainPageSidebar from '../Sidebar/MainPageSidebar';
import Navigation from '../Navigation';
import FreeTextSearch from '../Sidebar/FreeTextSearch';

const { Header, Sider } = Layout;

const MainPage = (props) => {
  const { filtersApplied } = props;
  return (
    <>
      <Layout style={{ height: '100%' }}>
        <Header id="header">
          <Navigation siteMode="explore" />
        </Header>
        <Layout>
          <Sider className="ant-sider" theme="light" width="18%" id="sidebar" style={{ height: '100%', maxWidth: '344px', width: '18%' }}>
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
};

export default MainPage;
