import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/dedupe'

import css from './infocard.css';

const InfoCard = ({
    label,
    selected,
    subLabel = "",
    onClick = () => {}
}) => (
  <div className={classNames('card', 'selected', { card: true, selected })} onClick={onClick}>
    <h1>{label.toUpperCase()}</h1>
    <h2>{subLabel.toUpperCase()}</h2>
  </div>
);

InfoCard.propTypes = {
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  subLabel: PropTypes.string,
  onClick: PropTypes.func
}

export default InfoCard;
