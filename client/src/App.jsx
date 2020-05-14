import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Row, Col } from 'antd';
import RecipeList from './components/RecipeList';
import Sidebar from './components/Sidebar';
import logo from './assets/cake-pop.svg';

const { Header, Sider } = Layout;

class App extends React.Component {
  async componentDidMount() {
    // nothing
  }

  render() {
    return (
      <Layout style={{ height: '100vh' }}>
        <Header id="header">
          <Row className="ant-row">
            <Col flex="100px">
              <img src={logo} alt="recipeify" id="logo" />
            </Col>
            <Col flex="auto"> </Col>
          </Row>
        </Header>
        <Layout>
          <Sider theme="light" id="sidebar" width="15%">
            <Sidebar />
          </Sider>
          <Layout id="content" style={{ padding: '0 24px 24px' }}>
            <RecipeList />
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default App;
