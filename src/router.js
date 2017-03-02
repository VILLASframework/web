/**
 * File: router.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router';

import App from './containers/app';
import Home from './containers/home';
import Projects from './containers/projects';
import Simulators from './containers/simulators';

class Root extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={App}>
          <Route path='/home' component={Home} />
          <Route path='/projects' component={Projects} />
          <Route path='/simulators' component={Simulators} />
        </Route>
      </Router>
    );
  }
}

export default Root;
