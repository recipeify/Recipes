import React from 'react';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import RecipeList from '../RecipeList';
import Sidebar from '../Sidebar';
import Navigation from '../Navigation';

const { Header, Sider } = Layout;

class RecipeBook extends React.Component {
  componentDidMount() {
    const { getUserRecipes, getUserPreferences, token } = this.props;
    getUserRecipes(token);
    getUserPreferences(token);
  }

  render() {
    return (
      <>
        <Layout style={{ height: '100%' }}>
          <Header id="header">
            <Navigation siteMode="myRecipes" />
          </Header>
          <Layout>
            <Sider theme="light" id="sidebar" width={400} style={{ height: '100%' }}>
              <Sidebar siteMode="myRecipes" />
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
  getUserPreferences: PropTypes.func.isRequired,
};

export default RecipeBook;
