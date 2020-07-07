import React from 'react';
import PropTypes from 'prop-types';
import {
  Layout,
  Menu,
  Row,
  Col,
} from 'antd';
import { ReactComponent as IngredientsIcon } from '../../../assets/ingredients.svg';
import { ReactComponent as SettingsIcon } from '../../../assets/clock.svg';
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
    this.setState({ openKeys: [] });
  };

  onTitleClick = (clickEvent) => {
    const {
      collapsed,
      openKeys,
    } = this.state;
    if (collapsed) {
      this.setState({ collapsed: !collapsed });
    } else {
      const index = openKeys.indexOf(clickEvent.key);
      if (index === -1) {
        this.setState((prevState) => ({ openKeys: [clickEvent.key, ...prevState.openKeys] }));
      } else {
        this.setState((prevState) => ({
          openKeys: prevState.openKeys.length === 1
            ? []
            : [...prevState.openKeys].splice(index - 1, 1),
        }));
      }
    }
  };

  render() {
    const {
      collapsed,
      openKeys,
    } = this.state;
    return (
      <Sider theme="light" width="18%" id="sidebar" collapsedWidth="5vw" style={{ height: '100%' }} collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        <div className="sidebar">
          <Menu theme="light" id="sidebar" mode="inline" triggerSubMenuAction="click" openKeys={openKeys} inlineCollapsed>
            <SubMenu key="ingredients" icon={<IngredientsIcon style={{ height: '1.5em', width: '1.5em' }} />} title={collapsed ? null : <span style={{ marginLeft: '5px' }}> Cook By Ingredients </span>} onTitleClick={this.onTitleClick}>
              <Row gutter={[16, 30]}>
                <Col span={23} style={{ padding: '15px 8px 15px 15px' }}>
                  <PreferenceSelect variant={selectVariants.INCLUDE_INGREDIENTS} />
                </Col>
              </Row>
              <Row gutter={[16, 30]}>
                <Col span={23} style={{ padding: '15px 8px 15px 15px' }}>
                  <PreferenceSelect variant={selectVariants.EXCLUDE_INGREDIENTS} />
                </Col>
              </Row>
            </SubMenu>
            <SubMenu key="moreFilters" icon={<SettingsIcon style={{ height: '1.5em', width: '1.5em' }} />} title={collapsed ? null : <span style={{ marginLeft: '5px' }}> Cook By Preferences </span>} onTitleClick={this.onTitleClick}>
              <Row gutter={[16, 30]}>
                <Col span={23} style={{ padding: '15px 8px 15px 15px' }}>
                  <PreferenceSelect variant={selectVariants.DIET} openDropdownOnClick />
                </Col>
              </Row>
              <Row gutter={[16, 30]}>
                <Col span={23} style={{ padding: '15px 8px 15px 15px' }}>
                  <PreferenceSelect variant={selectVariants.DISH_TYPE} openDropdownOnClick />
                </Col>
              </Row>
              <Row gutter={[16, 30]}>
                <Col span={23} style={{ padding: '15px 8px 15px 15px' }}>
                  <PreferenceSelect variant={selectVariants.CUISINE} openDropdownOnClick />
                </Col>
              </Row>
              <Row gutter={[16, 30]}>
                <Col span={23} style={{ padding: '15px 8px 15px 15px' }}>
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
