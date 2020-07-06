import React from 'react';
import PropTypes from 'prop-types';
import {
  Layout,
  Menu,
  Row,
  Col,
} from 'antd';
import IngredientsIcon from '../../../assets/ingredients.svg';
import SettingsIcon from '../../../assets/cook-settings.svg';
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

  onTitleClick = (clickEvent) => {
    const {
      collapsed,
      openKeys,
    } = this.state;
    if (collapsed) {
      this.setState({ collapsed: !collapsed });
    } else {
      console.log(clickEvent.key);
      console.log(openKeys);
      const index = openKeys.indexOf(clickEvent.key);
      if (index === -1) {
        this.setState((prevState) => ({ openKeys: [clickEvent.key, ...prevState.openKeys] }));
        console.log('add');
      } else {
        console.log(index);
        console.log([...openKeys]);
        this.setState((prevState) => ({
          openKeys: prevState.openKeys.length === 1 ? [] : [...prevState.openKeys].splice(index - 1, 1),
        }));
        console.log('remove');
      }
    }
  };

  render() {
    const {
      collapsed,
      openKeys,
    } = this.state;
    return (
      <Sider theme="light" id="sidebar" width={344} collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        <div className="sidebar">
          <Menu theme="light" id="sidebar" mode="inline" triggerSubMenuAction="click" openKeys={openKeys}>
            <SubMenu key="ingredients" icon={IngredientsIcon} title="Cook by Ingredients" onTitleClick={this.onTitleClick}>
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
            <SubMenu key="moreFilters" icon={SettingsIcon} title="Cook by Preferences" onTitleClick={this.onTitleClick}>
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
