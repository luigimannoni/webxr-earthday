/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import ReactGA from 'react-ga';

import Renderer from './components/Renderer';

import './App.scss';

class App extends Component {
  render() {
    ReactGA.initialize('UA-172483840-2');

    return (
      <div className="App">
        <Renderer />
      </div>
    );
  }
}

export default process.env.NODE_ENV === 'development' ? hot(App) : App;
