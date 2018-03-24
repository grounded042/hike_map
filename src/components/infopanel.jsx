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
      Object.keys(index).map(tripName => (
        <InfoCard
          key={tripName}
          label={tripName}
          subLabel={index[tripName].subLabel}
          selected={selectedTrip == tripName}
          onClick={() => onSelectTrip(tripName)}
        />
      ))
    }
  </div>
);

InfoPanel.propTypes = {
  index: PropTypes.object.isRequired,
  selectedTrip: PropTypes.string.isRequired,
  onSelectTrip: PropTypes.func.isRequired
};

export default InfoPanel;
