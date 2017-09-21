/**
 * File: app.js
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

import React from 'react';
import { Container } from 'flux/utils';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import NotificationSystem from 'react-notification-system';
import { Redirect, Route } from 'react-router-dom';
import { Col } from 'react-bootstrap';

import AppDispatcher from '../app-dispatcher';
import SimulationStore from '../stores/simulation-store';
import NodeStore from '../stores/node-store';
import UserStore from '../stores/user-store';
import NotificationsDataManager from '../data-managers/notifications-data-manager';

import Home from '../components/home';
import Header from '../components/header';
import Footer from '../components/footer';
import SidebarMenu from '../components/menu-sidebar';
import HeaderMenu from '../components/header-menu';

import Projects from './projects';
import Project from './project';
import Simulators from './simulators';
import Visualization from './visualization';
import Simulations from './simulations';
import Simulation from './simulation';
import Users from './users';

import '../styles/app.css';

class App extends React.Component {
  static getStores() {
    return [ NodeStore, UserStore, SimulationStore ];
  }

  static calculateState(prevState) {
    let currentUser = UserStore.getState().currentUser;

    return {
      nodes: NodeStore.getState(),
      simulations: SimulationStore.getState(),
      currentRole: currentUser ? currentUser.role : '',
      token: UserStore.getState().token,

      showSidebarMenu: false,
    };
  }

  componentWillMount() {
    // if token stored locally, request user
    const token = localStorage.getItem('token');

    if (token != null && token !== '') {
      // save token so we dont logout
      this.setState({ token });

      AppDispatcher.dispatch({
        type: 'users/logged-in',
        token: token
      });
    }
  }

  componentDidMount() {
    // load all simulators and simulations to fetch simulation data
    AppDispatcher.dispatch({
      type: 'nodes/start-load',
      token: this.state.token
    });

    AppDispatcher.dispatch({
      type: 'simulations/start-load',
      token: this.state.token
    });

    NotificationsDataManager.setSystem(this.refs.notificationSystem);
  }

  showSidebarMenu = () => {
    this.setState({ showSidebarMenu: true });
  }

  hideSidebarMenu = () => {
    this.setState({ showSidebarMenu: false });
  }

  render() {
    if (this.state.token == null) {
      return (<Redirect to="/login" />);
    }

    return (
      <div>
        <Col style={{ width: this.state.showSidebarMenu ? '280px' : '0px' }} smHidden mdHidden lgHidden className="sidenav">
          <HeaderMenu onClose={this.hideSidebarMenu} currentRole={this.state.currentRole} />
        </Col>

        <div className="app">
          <NotificationSystem ref="notificationSystem" />

          <Header onMenuButton={this.showSidebarMenu} showMenuButton={this.state.token != null} />

          <div className={`app-body app-body-spacing`} >
            <Col xsHidden>
              <SidebarMenu currentRole={this.state.currentRole} />
            </Col>

            <div className={`app-content app-content-margin-left`}>
              <Route exact path="/" component={Home} />
              <Route path="/home" component={Home} />
              <Route exact path="/projects" component={Projects} />
              <Route path="/projects/:project" component={Project} />
              <Route path="/visualizations/:visualization" component={Visualization} />
              <Route exact path="/simulations" component={Simulations} />
              <Route path="/simulations/:simulation" component={Simulation} />
              <Route path="/simulators" component={Simulators} />
              <Route path="/users" component={Users} />
            </div>
          </div>

          <Footer />
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Container.create(App));
