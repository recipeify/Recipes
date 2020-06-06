import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Row,
  Col,
  Avatar,
  Tooltip,
} from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth0 } from '../../react-auth0-spa';
import logo from '../../assets/cake-pop.svg';

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
      push={22}
      className="authentication"
    >
      {loading ? loadingButton : loginButton}
    </Col>
  );

  const loggedInRow = () => {
    const { loggedInUser } = props;
    const avatar = loggedInUser ? (
      <Avatar size="large" src={loggedInUser.picture} />
    ) : null;
    const name = loggedInUser ? loggedInUser.name : null;
    return (
      <Col
        flex="auto"
        className="authentication"
      >
        <Row gutter={20} justify="end">
          <Col flex="40px">
            {avatar}
          </Col>
          <Col>
            {name}
          </Col>
          <Col>
            <Tooltip title="Log out">
              <Button
                id="logout"
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
};
