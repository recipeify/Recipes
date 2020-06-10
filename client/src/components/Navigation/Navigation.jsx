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
import Icon, { LogoutOutlined, HomeFilled } from '@ant-design/icons';
import { useAuth0 } from '../../react-auth0-spa';
import logo from '../../assets/cropped-logo.svg';

const Navigation = (props) => {
  const {
    isAuthenticated, loginWithRedirect, logout, loading, user, getTokenSilently,
  } = useAuth0();

  useEffect(() => {
    const { isLoggedIn, onLogout, onLogin } = props;
    if (!isLoggedIn && isAuthenticated && user) {
      onLogin(user, getTokenSilently);
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
      className="login"
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
      goToMyRecipes,
      goToExplore,
      token,
    } = props;
    let button;
    if (isLoggedIn && siteMode === 'explore') {
      button = (
        <Button
          className="logout"
          onClick={() => goToMyRecipes(token)}
          icon={<Icon component={FaBookmark} />}
          type="ghost"
        >
          My Recipes
        </Button>
      );
    }
    if (siteMode === 'myRecipes') {
      button = (
        <Button
          className="logout"
          onClick={() => goToExplore()}
          icon={<HomeFilled />}
          type="ghost"
        >
          Explore
        </Button>
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
      <Avatar size="large" src={loggedInUser.picture} style={{ 'margin-top': '3px' }} />
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
          <Col style={{ 'margin-top': '4px' }}>
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
  goToMyRecipes: PropTypes.func.isRequired,
  goToExplore: PropTypes.func.isRequired,
  token: PropTypes.string,
};

Navigation.defaultProps = {
  token: '',
};
