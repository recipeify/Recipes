import React from 'react';
import PropTypes from 'prop-types';
import {
  Layout,
  Menu,
  Row,
  Col,
} from 'antd';
import { ShoppingCartOutlined, ReconciliationOutlined } from '@ant-design/icons';
import PreferenceSelect from '../PreferenceSelect';
import { selectVariants } from '../PreferenceSelect/PreferenceSelect';
import TimeSlider from '../TimeSlider';

const { Sider } = Layout;
const { SubMenu } = Menu;

class MainPageSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: [],
      collapsed: true,
    };
  }

  componentDidMount() {
    const {
      getResources,
    } = this.props;
    getResources();
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  onTitleClick = (key, __event) => {
    const {
      collapsed,
    } = this.state;
    console.log(this.state.openKeys);
    if (collapsed) {
      this.setState({ collapsed: !collapsed });
    } else {
      const index = this.state.openKeys.indexOf(key);
      if (index === -1) {
        this.setState({ openKeys: this.state.openKeys.push(key) });
      } else {
        this.setState({ openKeys: this.state.openKeys.splice(index, 1) });
      }
    }
  };

  render() {
    const {
      collapsed,
      openKeys,
    } = this.state;
    return (
      <Sider className="ant-sider" theme="light" width="18%" id="sidebar" style={{ height: '100%', maxWidth: '344px', width: '18%' }} collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        <div className="sidebar">
          <Menu theme="light" id="sidebar" mode="inline" triggerSubMenuAction="click" openKeys={openKeys}>
            <SubMenu key="ingredients" icon={<ShoppingCartOutlined />} title="Cook by Ingredients" onTitleClick={this.onTitleClick}>
              <Row gutter={[16, 30]}>
                <Col span={23}>
                  <PreferenceSelect variant={selectVariants.INCLUDE_INGREDIENTS} />
                </Col>
              </Row>
              <Row gutter={[16, 30]}>
                <Col span={23}>
                  <PreferenceSelect variant={selectVariants.EXCLUDE_INGREDIENTS} />
                </Col>
              </Row>
            </SubMenu>
            <SubMenu key="moreFilters" icon={<ReconciliationOutlined />} title="Cook by Preferences">
              <Row gutter={[16, 30]}>
                <Col span={23}>
                  <PreferenceSelect variant={selectVariants.DIET} openDropdownOnClick />
                </Col>
              </Row>
              <Row gutter={[16, 30]}>
                <Col span={23}>
                  <PreferenceSelect variant={selectVariants.DISH_TYPE} openDropdownOnClick />
                </Col>
              </Row>
              <Row gutter={[16, 30]}>
                <Col span={23}>
                  <PreferenceSelect variant={selectVariants.CUISINE} openDropdownOnClick />
                </Col>
              </Row>
              <Row gutter={[16, 30]}>
                <Col span={23}>
                  <TimeSlider />
                </Col>
              </Row>
            </SubMenu>
          </Menu>
        </div>
      </Sider>
    );
  }
}

MainPageSidebar.propTypes = {
  getResources: PropTypes.func.isRequired,
  user: PropTypes.shape({
    picture: PropTypes.string,
    name: PropTypes.string,
  }),
};

MainPageSidebar.defaultProps = {
  user: {},
};

export default MainPageSidebar;
