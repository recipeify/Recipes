/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { Button, Row, Col } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
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
    const { recipes } = this.props;
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
      <Button
        className="carousel-button"
        type="primary"
        shape="circle"
        size="middle"
        onClick={() => this.next()}
      >
        <CaretRightOutlined />
      </Button>
    );

    const prevButton = (
      <Button
        className="carousel-button"
        type="primary"
        shape="circle"
        size="middle"
        onClick={() => this.previous()}
      >
        <CaretLeftOutlined />
      </Button>
    );

    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 7,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 2000,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true,
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
      <Row justify="space-around" align="middle">
        <Col flex="24px">
          {prevButton}
        </Col>
        <Col style={{ maxWidth: '95%' }}>
          <div>
            <Slider
              className="carousel"
              // eslint-disable-next-line no-return-assign
              ref={(c) => (this.slider = c)}
              {...settings}
            >
              {recipeCards}
            </Slider>
          </div>
        </Col>
        <Col flex="24px">
          {nextButton}
        </Col>
      </Row>
    );
  }
}

RecipeCarousel.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RecipeCarousel;
