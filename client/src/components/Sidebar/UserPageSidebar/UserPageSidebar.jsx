import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Avatar,
} from 'antd';
import PreferenceSelect from '../PreferenceSelect';
import { selectVariants } from '../PreferenceSelect/PreferenceSelect';

class UserPageSiderbar extends React.Component {
  componentDidMount() {
    const { getResources } = this.props;
    getResources();
  }

  componentDidUpdate(prevProps) {
    const {
      token,
      diet,
      blacklist,
      updateUserPreferences,
    } = this.props;
    const dietChanged = diet.length !== prevProps.diet.length;
    const blacklistChanged = blacklist.length !== prevProps.blacklist.length;
    if (token && (dietChanged || blacklistChanged)) {
      updateUserPreferences(token, diet, blacklist);
    }
  }

  render() {
    const { user } = this.props;
    return (
      <div className="sidebar">
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21} style={{ textAlign: 'center', marginTop: '10px' }}>
            <Avatar src={user.picture} className="avatar" />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={21} style={{ textAlign: 'center' }}>
            <h1>{user.name}</h1>
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={22}>
            <PreferenceSelect variant={selectVariants.PERSONAL_DIET} openDropdownOnClick />
          </Col>
        </Row>
        <Row gutter={[16, 30]}>
          <Col offset={1} span={22}>
            <PreferenceSelect variant={selectVariants.PERSONAL_EXCLUDES} openDropdownOnClick />
          </Col>
        </Row>
      </div>
    );
  }
}

UserPageSiderbar.propTypes = {
  token: PropTypes.string,
  user: PropTypes.shape({
    picture: PropTypes.string,
    name: PropTypes.string,
  }),
  diet: PropTypes.arrayOf(PropTypes.object).isRequired,
  blacklist: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateUserPreferences: PropTypes.func.isRequired,
  getResources: PropTypes.func.isRequired,
};

UserPageSiderbar.defaultProps = {
  token: undefined,
  user: {},
};

export default UserPageSiderbar;
