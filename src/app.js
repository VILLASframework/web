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
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import NotificationSystem from 'react-notification-system';
import { Redirect, Route } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import { Hidden } from 'react-grid-system'

import AppDispatcher from './common/app-dispatcher';
import ScenarioStore from './scenario/scenario-store';
import SimulatorStore from './simulator/simulator-store';
import UserStore from './user/user-store';
import NotificationsDataManager from './common/data-managers/notifications-data-manager';

import Home from './common/home';
import Header from './common/header';
import Footer from './common/footer';
import SidebarMenu from './common/menu-sidebar';
import HeaderMenu from './common/header-menu';

//import Projects from './project/projects';
//import Project from './project/project';
import Simulators from './simulator/simulators';
import Dashboard from './dashboard/dashboard';
//import Simulations from './simulation/simulations';
//import Simulation from './simulation/simulation';
import Scenarios from './scenario/scenarios';
import Scenario from './scenario/scenario';
import SimulationModel from './simulationmodel/simulation-model';
import Users from './user/users';
import User from './user/user';
import ExDashboard from './dashboard/exdashboard';

import './styles/app.css';

class App extends React.Component {

  static getStores() {
    return [ SimulatorStore, UserStore, ScenarioStore];
  }

  static calculateState(prevState) {
    let currentUser = UserStore.getState().currentUser;

    return {
      simulators: SimulatorStore.getState(),
      scenarios: ScenarioStore.getState(),
      currentRole: currentUser ? currentUser.role : '',
      currentUsername: currentUser ? currentUser.username: '',
      currentUserID: UserStore.getState().userid,
      token: UserStore.getState().token,

      showSidebarMenu: false,
    };
  }

  componentWillMount() {
    // if token stored locally, request user
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userid');

    if (token != null && token !== '') {
      // save token so we dont logout
      this.setState({ token });

      AppDispatcher.dispatch({
        type: 'users/logged-in',
        token: token,
        userid: userid
      });
    }
  }

  componentDidMount() {
    // load all simulators and scenarios to fetch data
    AppDispatcher.dispatch({
      type: 'simulators/start-load',
      token: this.state.token
    });

    AppDispatcher.dispatch({
      type: 'scenarios/start-load',
      token: this.state.token
    });

    NotificationsDataManager.setSystem(this.refs.notificationSystem);
  }

  showSidebarMenu = () => {
    this.setState({ showSidebarMenu: true });
  };

  hideSidebarMenu = () => {
    this.setState({ showSidebarMenu: false });
  };

  render() {
    if (this.state.token == null) {
      return (<Redirect to="/login" />);
    }

    return (
      <DndProvider backend={HTML5Backend} >
        <div>
          {/*
          <Col style={{ width: this.state.showSidebarMenu ? '280px' : '0px' }} smHidden mdHidden lgHidden className="sidenav">
          */}
          <Hidden sm md lg xl>
            <Col style={{ width: this.state.showSidebarMenu ? '280px' : '0px' }} className="sidenav">
                <HeaderMenu onClose={this.hideSidebarMenu} currentRole={this.state.currentRole} />
            </Col>
          </Hidden>

          <div className="app">
            <NotificationSystem ref="notificationSystem" />

            <Header onMenuButton={this.showSidebarMenu} showMenuButton={false} />

            <div className={`app-body app-body-spacing`} >
              <Col xs={false}>
                <SidebarMenu currentRole={this.state.currentRole} />
              </Col>

              <div className={`app-content app-content-margin-left`}>
                <Route exact path="/" component={Home} />
                <Route path="/home" component={Home} />
                <Route path="/exdashboard/:dashboard" component={Dashboard} />
                <Route path="/dashboards/:dashboard" component={Dashboard} />
                <Route exact path="/scenarios" component={Scenarios} />
                <Route path="/scenarios/:scenario" component={Scenario} />
                <Route path="/simulationModel/:simulationModel" component={SimulationModel} />
                <Route path="/simulators" component={Simulators} />
                <Route path="/user" component={User} />
                <Route path="/users" component={Users} />
                <Route path="/exdashboard" component={ExDashboard} />
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </DndProvider>
    )
  }
}

// Removed routes
//<Route exact path="/projects" component={Projects} />
//<Route path="/projects/:project" component={Project} />
//<Route exact path="/simulations" component={Simulations} />
//<Route path="/simulations/:simulation" component={Simulation} />

let fluxContainerConverter = require('./common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(App));
//DragDropContext(HTML5Backend)(Container.create(App));
