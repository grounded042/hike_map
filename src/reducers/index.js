import * as redux from 'redux';
import {
  RECEIVE_TRIPS_INDEX,
  SET_SELECTED_TRIP_INFO,
  RECEIVE_TRIP_DETAILS,
  SET_WIDTH,
  SET_HEIGHT
} from '../actions';

const defaultWidth = window.innerWidth;
const defaultHeight = window.innerHeight - 150;

function hikeMap(state = {
  tripsIndex: [],
  selectedTrip: {
    id: "",
    tripName: "",
    details: {
      outerPoints: {},
      coordinates: []
    }
  },
  tripsDetailsList: {},
  viewport: {
    latitude: 37.785164,
    longitude: -100,
    zoom: 3.5,
    width: defaultWidth,
    height: defaultHeight
  }
}, action) {
  switch (action.type) {
    case RECEIVE_TRIPS_INDEX:
      return { ...state, tripsIndex: action.payload.tripsIndex };
    case SET_SELECTED_TRIP_INFO:
      return {
        ...state,
        selectedTrip: {
          id: action.payload.id,
          tripName: action.payload.tripName,
          details: state.tripsDetailsList[action.payload.id]
        },
        viewport: {
          ...state.viewport,
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
          zoom: action.payload.zoom
        }
      };
    case RECEIVE_TRIP_DETAILS:
      const { tripId, tripDetails } = action.payload;
      state.tripsDetailsList[tripId] = tripDetails;
      return state;
    case SET_WIDTH:
      return {
        ...state,
        viewport: {
          ...state.viewport,
          width: action.payload.width
        }
      }
    case SET_HEIGHT:
      return {
        ...state,
        viewport: {
          ...state.viewport,
          height: action.payload.height
        }
      }
    default:
      return state;
  }
}

export default hikeMap;
