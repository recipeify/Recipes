/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { Row, Col } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { capitalize } from 'lodash';
import RecipeCard from './RecipeList/components/RecipeCard';
import spinner from '../assets/Spin-1s-300px-transparent.gif';

class RecipeCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  next() {
    this.slider.slickNext();
  }

  previous() {
    this.slider.slickPrev();
  }

  render() {
    const { recipes, title } = this.props;
    if (recipes.length === 0) {
      return (
        <div className="recipe-list-placeholders">
          <img src={spinner} alt="" />
        </div>
      );
    }
    const recipeCards = recipes.map(
      (recipe) => <RecipeCard className="carousel-item" key={recipe.id} recipe={recipe} />,
    );

    const nextButton = (
      <a
        className="carousel-button"
        onClick={() => this.next()}
      >
        <CaretRightOutlined />
      </a>
    );

    const prevButton = (
      <a
        className="carousel-button"
        onClick={() => this.previous()}
      >
        <CaretLeftOutlined />
      </a>
    );

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 7,
      initialSlide: 0,
      // nextArrow:
      arrows: true,
      responsive: [
        {
          breakpoint: 2000,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };

    return (
      <div className="carousel" key={`carousel-${title}`}>
        <Row className="carousel-title">
          <h1>{capitalize(title)}</h1>
        </Row>
        <Row justify="space-around" align="middle">
          <Col flex="24px">
            {prevButton}
          </Col>
          <Col style={{ width: '97%' }}>
            <Slider
              className="carousel"
            // eslint-disable-next-line no-return-assign
              ref={(c) => (this.slider = c)}
              {...settings}
            >
              {recipeCards}
            </Slider>
          </Col>
          <Col flex="24px">
            {nextButton}
          </Col>
        </Row>
      </div>
    );
  }
}

RecipeCarousel.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
};

export default RecipeCarousel;
