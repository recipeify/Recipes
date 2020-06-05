import React from 'react';
import { Tag } from 'antd';
import PropTypes from 'prop-types';
import { getRandomID } from '../../../common/helpers';

const PreferenceTag = (props) => {
  const {
    index,
    variant,
    preferenceObj,
    viewMore,
    color,
    onClose,
  } = props;
  return (
    <Tag
      className="preference-chip"
      key={`${variant}${getRandomID()}`}
      closable
      onClose={() => onClose(preferenceObj)}
      visible={index <= 10 || viewMore}
      color={color || null}
    >
      <span>
        {preferenceObj.key}
      </span>
    </Tag>
  );
};

PreferenceTag.propTypes = {
  preferenceObj: PropTypes.shape({
    key: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  viewMore: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};


export default PreferenceTag;
