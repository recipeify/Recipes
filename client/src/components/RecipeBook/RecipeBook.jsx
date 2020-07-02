import React from 'react';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import RecipeList from '../RecipeList';
import Navigation from '../Navigation';
import UserPageSiderbar from '../Sidebar/UserPageSidebar';

const { Header, Sider } = Layout;

class RecipeBook extends React.Component {
  componentDidMount() {
    const { getUserRecipes, token } = this.props;
    if (token) {
      getUserRecipes(token);
    }
  }

  render() {
    return (
      <>
        <Layout style={{ height: '100%' }}>
          <Header id="header">
            <Navigation siteMode="myRecipes" />
          </Header>
          <Layout>
            <Sider theme="light" id="sidebar" style={{ height: '100%' }}>
              <UserPageSiderbar />
            </Sider>
            <Layout id="content" style={{ padding: '0 24px 24px' }}>
              <RecipeList siteMode="myRecipes" />
            </Layout>
          </Layout>
        </Layout>
      </>
    );
  }
}

RecipeBook.propTypes = {
  token: PropTypes.string.isRequired,
  getUserRecipes: PropTypes.func.isRequired,
};

export default RecipeBook;
