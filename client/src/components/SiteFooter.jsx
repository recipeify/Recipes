import React from 'react';
import { Row, Col } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const SiteFooter = () => (
  <Row justify="center" gutter={60}>
    <Col>
      <Link to="/privacy">Privacy Policy</Link>
    </Col>
    <Col>
      <Row align="middle" gutter={10}>
        <Col>
          <GithubOutlined style={{ fontSize: '18px' }} />
        </Col>
        <Col>
          <a href="https://github.com/recipeify">Source</a>
        </Col>
      </Row>
    </Col>
  </Row>
);

export default SiteFooter;
