/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import ReactMapGL, {FlyToInterpolator} from 'react-map-gl';
import {trimDownPoints} from '../util';
import hikeLayer from '../hike_layer.json';
import { buildLayerName } from '../actions';

const BACKEND_LOCATION = CONFIG_BACKEND_LOCATION;
const MAPBOX_TOKEN = CONFIG_MAPBOX_TOKEN;
const DEFAULT_MAP_STYLE = CONFIG_MAPBOX_STYLE;

export default class Map extends React.Component {
  static propTypes = {
    tripName: PropTypes.string.isRequired,
    coordinates: PropTypes.array.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onResize: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      viewport: {
        latitude: 37.785164,
        longitude: -100,
        zoom: 3.5,
        bearing: 0,
        pitch: 0,
        width: window.innerWidth,
        height: window.innerHeight - 150
      }
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.props.onResize);
    this.props.onResize();
  }

  componentDidUpdate(prevProps, prevState) {
    const prevLayerId = buildLayerName(prevProps.tripName);
    const curLayerId = buildLayerName(this.props.tripName);

    if (curLayerId !== prevLayerId && this.props.tripName !== "") {
      if (prevProps.tripName !== "") { this._hideLayer(prevLayerId); }
      this._addOrShowLayerWithId(curLayerId);

      const newViewport = {
        latitude: this.props.latitude,
        longitude: this.props.longitude,
        zoom: this.props.zoom,
        width: this.props.width,
        height: this.props.height,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 3000
      };

      this._onViewportChange(newViewport);
    }
  }

  _onViewportChange = viewport => this.setState({
    viewport: { ...this.state.viewport, ...viewport }
  });

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _hideLayer = (layerId) => {
    const map = this.map.getMap();

    if (map.getLayer(layerId) === undefined) { return; }

    const visibility = map.getLayoutProperty(layerId, 'visibility');
    if (visibility === 'visible') {
        map.setLayoutProperty(layerId, 'visibility', 'none');
    }
  }

  _addOrShowLayerWithId = (layerId) => {
    if (this.props.coordinates.length === 0) {
      return;
    }

    const map = this.map.getMap();
    if (map.getLayer(layerId) !== undefined) {
      const visibility = map.getLayoutProperty(layerId, 'visibility');

      if (visibility !== 'visible') {
          map.setLayoutProperty(layerId, 'visibility', 'visible');
      }

      return;
    }

    const layer = {
      ...hikeLayer,
      id: layerId,
      source: {
        ...hikeLayer.source,
        data: {
          ...hikeLayer.source.data,
          geometry: {
            ...hikeLayer.source.data.geometry,
            coordinates: this.props.coordinates
          }
        }
      }
    };

    // if (!map.isStyleLoaded()) {
    //   map.on('load', () => {
    //     map.addLayer(layer);
    //   });
    // } else {
      map.addLayer(layer);
    // }
  }

  render() {
    const {viewport} = this.state;

    return (
      <ReactMapGL
        ref={(map) => { this.map = map; }}
        {...viewport}
        mapStyle={DEFAULT_MAP_STYLE}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={this._onViewportChange}
      >
      </ReactMapGL>
    );
  }

}
