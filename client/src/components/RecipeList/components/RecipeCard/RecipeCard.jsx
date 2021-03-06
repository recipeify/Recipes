import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Modal, Button, Tag, Divider, Row, Col, Tooltip, message,
} from 'antd';
import DotLoader from 'react-spinners/DotLoader';
import {
  InfoCircleOutlined, StarOutlined, ExportOutlined,
  CloseCircleOutlined, StarFilled, LoadingOutlined,
} from '@ant-design/icons';
import capitalize from 'lodash/capitalize';
// import Img from 'react-image';
import RecipeNames from './RecipeConsts';
import { getRandomID, minutesToText } from '../../../../common/helpers';

const { Meta } = Card;


class RecipeCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false, viewMoreTags: false, loadRecipeBookChange: false, loading: true,
    };
  }


  componentDidUpdate(prevProps) {
    const { recipe } = this.props;
    const { isSaved } = recipe;
    if (isSaved !== prevProps.recipe.isSaved) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ loadRecipeBookChange: false });
    }
  }

  showModal = () => {
    this.setState({
      showModal: true,
    });
  };

  hideModal = () => {
    this.setState({
      showModal: false,
    });
  };

  onLoad = () => {
    this.setState({
      loading: false,
    });
  };


  render() {
    const {
      recipe, isLoggedIn, viewRecipe, addRecipe, token, removeRecipe,
    } = this.props;
    const {
      title, link, image: imageURL, total_time: totalTime, rating, number_of_raters: numberOfRaters,
      tags, id, isSaved = undefined,
    } = recipe;
    const viewMoreText = `${tags.length - 5} more`;
    const {
      showModal, viewMoreTags, loadRecipeBookChange, loading,
    } = this.state;
    let imgSrc = imageURL;
    if (process.env.NODE_ENV === 'production') {
      const clSrc = 'https://res.cloudinary.com/recipeify/image/fetch/f_auto,w_520,q_90/';
      imgSrc = imageURL.includes('bbcgoodfood') ? clSrc.concat('https:', encodeURIComponent(imageURL)) : clSrc.concat(encodeURIComponent(imageURL));
    }

    const openRecipe = (e) => {
      e.stopPropagation();
      window.open(link, '_blank');
      if (isLoggedIn) {
        viewRecipe(token, id);
      }
    };

    const saveRecipe = (e) => {
      e.stopPropagation();
      if (isLoggedIn) {
        this.setState({ loadRecipeBookChange: true });
        addRecipe(token, id);
      } else {
        message.info('To save a recipe, please log in', 5);
      }
    };

    const unsaveRecipe = (e) => {
      e.stopPropagation();
      if (isLoggedIn) {
        this.setState({ loadRecipeBookChange: true });
        removeRecipe(token, id);
      } else {
        message.info('To save a recipe, please log in', 5);
      }
    };

    const findSite = () => Object.entries(RecipeNames)
      .find((pair) => new RegExp(pair[0]).test(id))[1];

    const site = findSite();

    const starButton = (save = false, inModal) => {
      if (save) {
        return (
          <Button
            className={`recipe-button${inModal ? ' modal-star-button' : ''}`}
            type={inModal ? 'ghost' : 'link'}
            size="large"
            onClick={saveRecipe}
          >
            {/* eslint-disable-next-line max-len */}
            {loadRecipeBookChange && (!showModal || inModal) ? <LoadingOutlined /> : <StarOutlined /> }
          </Button>
        );
      }
      return (
        <Button
          className={`recipe-button${inModal ? ' modal-star-button' : ''}`}
          type={inModal ? 'ghost' : 'link'}
          size="large"
          onClick={unsaveRecipe}
        >
          {loadRecipeBookChange && (!showModal || inModal) ? <LoadingOutlined /> : <StarFilled /> }
        </Button>
      );
    };

    const getStarButton = (inModal) => {
      if (loadRecipeBookChange) {
        return starButton(!isSaved, inModal);
      }
      if (isSaved) {
        return (
          <Tooltip title="Remove from my cookbook">
            {starButton(false, inModal)}
          </Tooltip>
        );
      }
      return (
        <Tooltip key="star" title="Add to my cookbook">
          {starButton(true, inModal)}
        </Tooltip>
      );
    };

    return (
      <div>
        <Card
          className="recipe-card"
          onClick={this.showModal}
          loading={loading}
          hoverable
          cover={(
            <div className="recipe-image-container">
              <div>
                <img
                  className="recipe-image"
                  src={imgSrc}
                  alt={title}
                  onLoad={this.onLoad}
                />
              </div>
              <div
                className={`loading ${loading ? ' active' : ' hidden'}`}
              >
                <DotLoader
                  size={60}
                  color="#ec7533"
                />
              </div>
            </div>
          )}
          actions={[
            <Tooltip title="Show info">
              <Button className="recipe-button" block type="link" size="large" onClick={this.showModal}>
                <InfoCircleOutlined />
              </Button>
            </Tooltip>,
            getStarButton(false),
            <Tooltip title="Go to recipe">
              <Button className="recipe-button" block type="link" size="large" onClick={openRecipe}>
                <ExportOutlined />
              </Button>
            </Tooltip>,
          ]}
        >
          <Meta
            className="recipe-card-meta"
            title={title}
            description={rating ? [site,
              <span key={`${recipe.id}-meta`} style={{ float: 'right' }}>
                {` ${parseFloat((rating * 5).toFixed(2))}/5 `}
                <StarFilled />
              </span>] : site}
          />
        </Card>

        <Modal
          title={title}
          visible={showModal}
          onCancel={this.hideModal}
          footer={[
            getStarButton(true),
            <Button onClick={openRecipe} size="large" type="primary" className="recipe-modal-goto-btn">
              {` View in ${site}`}
            </Button>,
          ]}
        >
          <img
            className="recipe-modal-image"
            src={imgSrc}
            alt={title}
          />

          <Divider />
          <Row gutter={[5, 3]}>
            <Col span={8}>
              <h3
                className="modal-sitename-label"
              >
                Website
              </h3>
            </Col>
            <Col span={8}>
              <h3
                className="modal-cookingtime-label"
              >
                Cooking Time
              </h3>
            </Col>
            <Col span={8}>
              <h3
                className="modal-rating-label"
              >
                Rating
              </h3>
            </Col>
          </Row>
          <Row gutter={[5, 5]}>
            <Col span={8}>
              {site}
            </Col>
            <Col span={8}>
              {totalTime ? minutesToText(totalTime)
                : (
                  <span>
                    <CloseCircleOutlined />
                    {' Unavailable'}
                  </span>
                )}
            </Col>
            <Col span={8}>
              {rating
                ? (
                  <span>
                    {` ${parseFloat((rating * 5).toFixed(2))}/5 `}
                    <StarFilled />
                    {` from ${numberOfRaters} ${numberOfRaters > 1 ? 'raters' : 'rater'}`}
                  </span>
                )
                : (
                  <span>
                    <CloseCircleOutlined />
                    {' Unavailable'}
                  </span>
                )}
            </Col>
          </Row>
          <Row span={18}>
            <h3
              className="modal-tags-label"
            >
              Tags
            </h3>
          </Row>
          <Row span={18}>
            {
              tags.map((tag, index) => (
                <Tag
                  className="preference-chip"
                  visible={index < 5 || viewMoreTags}
                  key={`recipe-tag ${getRandomID()}`}
                >
                  <span>
                    {capitalize(tag)}
                  </span>
                </Tag>
              ))
            }
            {tags.length > 5 && (
            <Button
              className="modal-tag-button"
              onClick={() => {
                this.setState({ viewMoreTags: !viewMoreTags });
              }}
              size="small"
            >
              <span>
                {!viewMoreTags ? viewMoreText : 'Show less'}
              </span>
            </Button>
            )}
          </Row>
        </Modal>
      </div>
    );
  }
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
    image: PropTypes.string,
    total_time: PropTypes.number,
    rating: PropTypes.number,
    number_of_raters: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
    isSaved: PropTypes.bool,
  }).isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  viewRecipe: PropTypes.func.isRequired,
  addRecipe: PropTypes.func.isRequired,
  removeRecipe: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default RecipeCard;
