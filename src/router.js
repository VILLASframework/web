/**
 * File: router.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 *
 * This file is part of VILLASweb.
 *
 * VILLASweb is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * VILLASweb is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with VILLASweb. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';

import App from './containers/app';
import Home from './containers/home';
import Projects from './containers/projects';
import Project from './containers/project';
import Simulators from './containers/simulators';
import Visualization from './containers/visualization';
import Simulations from './containers/simulations';
import Simulation from './containers/simulation';
import Users from './containers/users';
import Login from './containers/login';
import Logout from './containers/logout';

class Root extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={App}>
          <Route path='/home' component={Home} />

          <Route path='/projects' component={Projects} />
          <Route path='/projects/:project' component={Project} />

          <Route path='/simulators' component={Simulators} />

          <Route path='/visualizations/:visualization' component={Visualization} />

          <Route path='/simulations' component={Simulations} />
          <Route path='/simulations/:simulation' component={Simulation} />

          <Route path='/users' component={Users} />

          <Route path='/logout' component={Logout} />
        </Route>

        <Route path='/login' component={Login} />
      </Router>
    );
  }
}

export default Root;
