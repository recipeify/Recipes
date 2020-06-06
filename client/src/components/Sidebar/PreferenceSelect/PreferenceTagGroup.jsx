import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { getRandomID } from '../../../common/helpers';
import PreferenceTag from './PreferenceTag';

class PreferenceTagGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMore: false,
    };
  }

  render() {
    const {
      appliedPreferenceList,
      variant,
      onClose,
      color,
    } = this.props;
    const viewMoreText = `${appliedPreferenceList.length - 10} more`;
    const { viewMore } = this.state;
    return (
      <div>
        {appliedPreferenceList.map((preference, index) => (
          <PreferenceTag
            key={`${variant}${getRandomID()}`}
            onClose={onClose}
            preferenceObj={preference}
            index={index}
            color={color}
            variant={variant}
            viewMore={viewMore}
          />
        ))}
        {appliedPreferenceList.length > 10 && (
          <Button
            className="preference-tag-button"
            key={`${variant}${getRandomID()}`}
            onClick={() => {
              this.setState({ viewMore: !viewMore });
            }}
            size="small"
          >
            {!viewMore ? viewMoreText : 'Show less'}
          </Button>
        )}
      </div>
    );
  }
}

PreferenceTagGroup.propTypes = {
  appliedPreferenceList: PropTypes.arrayOf(PropTypes.object).isRequired,
  variant: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  color: PropTypes.string,
};

PreferenceTagGroup.defaultProps = {
  color: null,
};

export default PreferenceTagGroup;
