/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { AppContainer } from 'react-hot-loader';
import App from './app.jsx';

ReactDOM.render(<AppContainer><App/></AppContainer>, document.querySelector("#app"));

if (module && module.hot) {
  module.hot.accept('./app.jsx', () => {
    const App = require('./app.jsx').default;
    render(
      <AppContainer>
        <App/>
      </AppContainer>,
      document.querySelector("#app")
    );
  });
}

// ReactDOM.render(<App/>, document.body.appendChild(document.createElement('div')));
