import React from 'react';
import './styles/main.css';
import createHistory from 'history/createBrowserHistory'
import { routerReducer, routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import hikeMap from './reducers';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import MapAndControlsContainer from './containers/mapandcontrols.js';
import { fetchTripsIndex } from './actions';

const history = createHistory();
const rMiddleware = routerMiddleware(history);
const store = createStore(
  combineReducers({
    hikeMap,
    router: routerReducer
  }),
  applyMiddleware(...[thunk, rMiddleware])
);

store.dispatch(fetchTripsIndex());

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <Router history={history}>
            <Route path="/" component={MapAndControlsContainer} />
          </Router>
        </Provider>
      </div>
    )
  }
}
