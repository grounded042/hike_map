import React from 'react';
import PropTypes from 'prop-types';
import InfoCard from './infocard.jsx';

import css from './infopanel.css';

const InfoPanel = ({
  index,
  selectedTrip,
  onSelectTrip
}) => (
  <div className="info-panel">
    {
      index.map(trip => (
        <InfoCard
          key={trip.index}
          label={trip.label}
          subLabel={trip.subLabel}
          selected={selectedTrip == trip.id}
          onClick={() => onSelectTrip(trip.id)}
        />
      ))
    }
  </div>
);

InfoPanel.propTypes = {
  index: PropTypes.array.isRequired,
  selectedTrip: PropTypes.string.isRequired,
  onSelectTrip: PropTypes.func.isRequired
};

export default InfoPanel;
