import geoViewport from "../util/geoViewport";

const BACKEND_LOCATION = CONFIG_BACKEND_LOCATION;

export const RECEIVE_TRIPS_INDEX = 'RECEIVE_TRIPS_INDEX';
function receiveTripsIndex(tripsIndex) {
  return {
    type: RECEIVE_TRIPS_INDEX,
    payload: {
      tripsIndex
    }
  };
}

export function fetchTripsIndex() {
  return (dispatch) => {
    return fetch(`${BACKEND_LOCATION}index.json`)
      .then(res => res.json(), eRes => console.log("error fetching trips index", eRes))
      .then(
        tripsIndex => dispatch(receiveTripsIndex(tripsIndex)),
        eRes => console.log("error fetching trips index", eRes)
      );
  }
}

export const SET_SELECTED_TRIP_INFO = 'SET_SELECTED_TRIP_INFO';
function _setSelectedTrip(id, tripName, latitude, longitude, zoom) {
  return {
    type: SET_SELECTED_TRIP_INFO,
    payload: {
      id,
      tripName,
      latitude,
      longitude,
      zoom
    }
  };
}

export const SET_WIDTH = 'SET_WIDTH';
export function setWidth(width) {
  return {
    type: SET_WIDTH,
    payload: {
      width
    }
  };
}

export const SET_HEIGHT = 'SET_HEIGHT';
export function setHeight(height) {
  return {
    type: SET_HEIGHT,
    payload: {
      height
    }
  };
}

export function getWidthMapShouldBe() {
  return window.innerWidth;
}

export function getHeightMapShouldBe() {
  return window.innerHeight - 150;
}

export const RECEIVE_TRIP_DETAILS = 'RECEIVE_TRIP_DETAILS';
function receiveTripDetails(tripId, tripDetails) {
  return {
    type: RECEIVE_TRIP_DETAILS,
    payload: {
      tripId,
      tripDetails
    }
  };
}

function _fetchTripDetails(tripId) {
  return (dispatch, getState) => {
    const indexInfo = getState().hikeMap.tripsIndex.find((tripIndexInfo) => {
      return tripIndexInfo.id === tripId;
    });

    return fetch(`${BACKEND_LOCATION}${indexInfo.detailsLocation}`)
      .then(res => res.json(), eRes => console.log("error fetching trip details", tripId, eRes))
      .then(tripDetails => dispatch(receiveTripDetails(tripId, tripDetails)));
  }
}

function _calcAndSetViewportForTrip(tripId) {
  return (dispatch, getState) => {
    const outerPoints = getState().hikeMap.tripsDetailsList[tripId].outerPoints;
    const tripName = getState().hikeMap.tripsDetailsList[tripId].name;
    const { width, height } = getState().hikeMap.viewport;
    const calcView = geoViewport.calcViewFromOuterPointsAndSize(outerPoints, width, height);

    dispatch(_setSelectedTrip(tripId, tripName, calcView.center[1], calcView.center[0], calcView.zoom - 1));
  }
}

function _selectTrip(tripId) {
  return (dispatch, getState) => {
    if (getState().hikeMap.tripsDetailsList.hasOwnProperty(tripId)) {
      return dispatch(_calcAndSetViewportForTrip(tripId));
    }

    return dispatch(_fetchTripDetails(tripId)).then(() => {
      dispatch(_calcAndSetViewportForTrip(tripId));
    });
  };
}

export function navigateToTrip(tripId) {
  return (dispatch) => {
    return dispatch(fetchTripsIndex()).then(() => dispatch(_selectTrip(tripId)));
  };
}

export function buildLayerName(tripId) {
  return `layer_${tripId.trim().replace(" ", "_")}`;
}
