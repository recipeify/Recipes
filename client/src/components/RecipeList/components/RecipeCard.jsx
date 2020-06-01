import React from 'react';
import PropTypes from 'prop-types';
import { Card, Modal, Button, Tag, Descriptions, Divider } from 'antd';
import { InfoCircleOutlined, StarOutlined, ExportOutlined, CloseCircleOutlined, StarFilled } from '@ant-design/icons';
import RecipeNames from './RecipeConsts';

const { Meta } = Card;

class RecipeCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {showModal: false, viewMore: false,};
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


  render() {
    const { recipe } = this.props;
    const { title, link, image: imageURL, total_time, rating, number_of_raters, tags, id } = recipe;
    const viewMoreText = `${tags.length - 5} more`;
    const { showModal, viewMore } = this.state;

    const openRecipe = () => {
          window.open(link, 'noopener noreferrer');
      };

    const findSite = (id) => {
        for (let [siteRegex, siteName] of Object.entries(RecipeNames)) {
            let site = new RegExp(siteRegex);
            if (site instanceof RegExp && site.test(id)){
                return siteName;
            }
        }
    };

    return (
      <>
        <Card
          className="recipe-card"
          // onClick={() => openRecipe(link)}
          hoverable
          cover={(
            <img
              className="recipe-image"
              src={imageURL}
              alt={title}
            />
          )}

          actions={[
            <li className="recipe-button" onClick={this.showModal}><InfoCircleOutlined /></li>,
            <li className="recipe-button" onClick={() => alert('hello2')}><StarOutlined /></li>,
            <li className="recipe-button" onClick={() => alert('hello3')}><ExportOutlined /></li>,
          ]}
        >
          <Meta
            className="recipe-card-meta"
            title={title}
          />
        </Card>
        <Modal
          title={title}
          visible={showModal}
          onCancel={this.hideModal}
          footer={[
              <Button key="Save">
                  <StarOutlined />
              </Button>,
            <Button key="Go" onClick={openRecipe}>
              <ExportOutlined />
            </Button>,
          ]}
        >
            <img
                className="recipe-modal-image"
                src={imageURL}
                alt={title}
            />

            <Divider/>
            <Descriptions title="Recipe Info" layout="vertical" colon={false}>
                <Descriptions.Item label="Website">{ findSite(id) }</Descriptions.Item>
                <Descriptions.Item label="Cooking Time">{total_time ? total_time + ' minutes' : <span> <CloseCircleOutlined /> Unavailable </span> }</Descriptions.Item>

                <Descriptions.Item label="Rating">{ rating ? <span>  {parseFloat((rating * 5).toFixed(2))}/5 <StarFilled /> from { number_of_raters } {number_of_raters > 1 ? 'raters' : 'rater'} </span> : <span> <CloseCircleOutlined /> Unavailable </span> }</Descriptions.Item>

            <Descriptions.Item label="Tags" span={3}>
                {
                    tags.map((tag, index) => (
                        <Tag
                        className='recipe-tag'
                        visible={index < 5 || viewMore}> <span> {tag } </span></Tag>
                    ))
                }
                {tags.length > 5 && (
                    <Button
                        className="more-tags-button"
                        onClick={() => {
                            this.setState({ viewMore: !viewMore });
                        }}
                        size="small"
                    >
                        <span>
                            {!viewMore ? viewMoreText : 'Show less'}
                        </span>
                    </Button>
                )}
            </Descriptions.Item>
            </Descriptions>
        </Modal>
      </>
    );
  }
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};

export default RecipeCard;
