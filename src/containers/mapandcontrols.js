import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Map from '../components/map.jsx';
import InfoPanel from '../components/infopanel.jsx';
import { push } from 'react-router-redux';
import { navigateToTrip, setWidth, getWidthMapShouldBe, setHeight, getHeightMapShouldBe, onViewportChange } from '../actions';

class MapAndControls extends React.Component {
  static propTypes = {
    tripsIndex: PropTypes.array.isRequired,
    selectedTrip: PropTypes.string.isRequired,
    onSelectTrip: PropTypes.func.isRequired,
    navigateToTrip: PropTypes.func.isRequired,

    tripName: PropTypes.string.isRequired,
    tripId: PropTypes.string.isRequired,
    coordinates: PropTypes.array.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onResize: PropTypes.func.isRequired,
  };

  _navigateToTripFromLocation() {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const tripId = params.get('tripId');
    this.props.navigateToTrip(tripId);
  }

  componentDidMount() {
    if (this.props.location.search !== "") {
      this._navigateToTripFromLocation();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.search !== prevProps.location.search) {
      this._navigateToTripFromLocation();
    }
  }

  render() {
    return (
      <div>
        <div>
          <Map
            tripName={this.props.tripName}
            tripId={this.props.tripId}
            coordinates={this.props.coordinates}
            latitude={this.props.latitude}
            longitude={this.props.longitude}
            zoom={this.props.zoom}
            width={this.props.width}
            height={this.props.height}
            onResize={this.props.onResize}
          />
        </div>
        <InfoPanel
          index={this.props.tripsIndex}
          selectedTrip={this.props.selectedTrip}
          onSelectTrip={this.props.onSelectTrip}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    tripsIndex: state.hikeMap.tripsIndex,
    selectedTrip: state.hikeMap.selectedTrip.id,
    coordinates: state.hikeMap.selectedTrip.details.coordinates,
    tripName: state.hikeMap.selectedTrip.tripName,
    tripId: state.hikeMap.selectedTrip.id,
    latitude: state.hikeMap.viewport.latitude,
    longitude: state.hikeMap.viewport.longitude,
    zoom: state.hikeMap.viewport.zoom,
    width: state.hikeMap.viewport.width,
    height: state.hikeMap.viewport.height,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectTrip: (tripId) => dispatch(push(`?tripId=${tripId}`)),
    navigateToTrip: (tripId) => dispatch(navigateToTrip(tripId)),
    onResize: () => {
      dispatch(setWidth(getWidthMapShouldBe()));
      dispatch(setHeight(getHeightMapShouldBe()));
    }
  };
};

const MapAndControlsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapAndControls);

export default MapAndControlsContainer;
