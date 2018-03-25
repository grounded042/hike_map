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
function _setSelectedTrip(tripName, latitude, longitude, zoom) {
  return {
    type: SET_SELECTED_TRIP_INFO,
    payload: {
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
function receiveTripDetails(tripName, tripDetails) {
  return {
    type: RECEIVE_TRIP_DETAILS,
    payload: {
      tripName,
      tripDetails
    }
  };
}

function _fetchTripDetails(tripName) {
  return (dispatch, getState) => {
    const tripDetailsLocation = getState().hikeMap.tripsIndex[tripName].detailsLocation;

    return fetch(`${BACKEND_LOCATION}${tripDetailsLocation}`)
      .then(res => res.json(), eRes => console.log("error fetching trip details", tripName, eRes))
      .then(tripDetails => dispatch(receiveTripDetails(tripName, tripDetails)));
  }
}

function _calcAndSetViewportForTrip(tripName) {
  return (dispatch, getState) => {
    const outerPoints = getState().hikeMap.tripsDetailsList[tripName].outerPoints;
    const { width, height } = getState().hikeMap.viewport;
    const calcView = geoViewport.calcViewFromOuterPointsAndSize(outerPoints, width, height);

    dispatch(_setSelectedTrip(tripName, calcView.center[1], calcView.center[0], calcView.zoom - 1));
  }
}

function _selectTrip(tripName) {
  return (dispatch, getState) => {
    if (getState().hikeMap.tripsDetailsList.hasOwnProperty(tripName)) {
      return dispatch(_calcAndSetViewportForTrip(tripName));
    }

    return dispatch(_fetchTripDetails(tripName)).then(() => {
      dispatch(_calcAndSetViewportForTrip(tripName));
    });
  };
}

export function navigateToTrip(tripName) {
  return (dispatch) => {
    return dispatch(fetchTripsIndex()).then(() => dispatch(_selectTrip(tripName)));
  };
}

export function buildLayerName(tripName) {
  return `layer_${tripName.trim().replace(" ", "_")}`;
}
