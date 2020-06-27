/* eslint-disable react/no-unused-prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Row,
  Col,
  Avatar,
  Tooltip,
} from 'antd';
import { FaBookmark } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Icon, { LogoutOutlined, HomeFilled } from '@ant-design/icons';
import { useAuth0 } from '../../react-auth0-spa';
import logo from '../../assets/cropped-logo.svg';

const Navigation = (props) => {
  const {
    isAuthenticated, loginWithRedirect, logout, loading, user, getTokenSilently,
  } = useAuth0();

  useEffect(() => {
    const {
      isLoggedIn,
      onLogout,
      onLogin,
      diets,
      ingredients,
    } = props;
    if (!isLoggedIn && isAuthenticated && user) {
      onLogin(user, getTokenSilently, ingredients, diets);
    }
    if (isLoggedIn && !isAuthenticated) {
      onLogout(user);
    }
  });

  const loginButton = (
    <Button
      className="login"
      type="primary"
      onClick={() => loginWithRedirect({})}
    >
      Log in
    </Button>
  );

  const loadingButton = (
    <Button
      className="loading"
      type="primary"
      loading
    >
      Loading
    </Button>
  );

  const notLoggedInRow = (
    <Col
      flex="auto"
      className="authentication"
    >
      <Row gutter={20} justify="end">
        <Col flex="40px">
          {loading ? loadingButton : loginButton}
        </Col>
      </Row>
    </Col>
  );


  const modeSwitchButton = () => {
    const {
      siteMode,
      isLoggedIn,
    } = props;
    let button;
    if (isLoggedIn && siteMode === 'explore') {
      button = (
        <Link to="/myrecipes">
          <Button
            className="logout"
            icon={<Icon component={FaBookmark} />}
            type="ghost"
          >
            My Recipes
          </Button>
        </Link>
      );
    }
    if (siteMode === 'myRecipes') {
      button = (
        <Link to="/">
          <Button
            className="logout"
            icon={<HomeFilled />}
            type="ghost"
          >
            Explore
          </Button>
        </Link>
      );
    }
    if (!modeSwitchButton) {
      return null;
    }
    return (
      <Col>
        {button}
      </Col>
    );
  };


  const loggedInRow = () => {
    const { loggedInUser } = props;
    const avatar = loggedInUser ? (
      <Avatar size="large" src={loggedInUser.picture} style={{ marginTop: '3px' }} />
    ) : null;
    const name = loggedInUser ? loggedInUser.name : null;
    return (
      <Col
        flex="auto"
        className="authentication"
      >
        <Row gutter={20} justify="end">
          <Col>
            {modeSwitchButton()}
          </Col>
          <Col flex="40px">
            {avatar}
          </Col>
          <Col style={{ marginTop: '4px' }}>
            {name}
          </Col>
          <Col>
            <Tooltip title="Log out">
              <Button
                className="logout"
                shape="circle"
                icon={<LogoutOutlined />}
                type="ghost"
                onClick={() => logout()}
              />
            </Tooltip>
          </Col>
        </Row>
      </Col>
    );
  };

  return (
    <Row className="ant-row">
      <Col flex="100px">
        <img src={logo} alt="recipeify" id="logo" />
      </Col>
      {isAuthenticated ? loggedInRow() : notLoggedInRow}
    </Row>
  );
};

export default Navigation;

Navigation.propTypes = {
  loggedInUser: PropTypes.shape({
    name: PropTypes.string,
    picture: PropTypes.string,
  }).isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  siteMode: PropTypes.string.isRequired,
  token: PropTypes.string,
  ingredients: PropTypes.arrayOf(PropTypes.object),
  diets: PropTypes.arrayOf(PropTypes.object),
};

Navigation.defaultProps = {
  token: '',
  diets: [],
  ingredients: [],
};
