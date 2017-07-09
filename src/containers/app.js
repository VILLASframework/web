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

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import NotificationSystem from 'react-notification-system';

import AppDispatcher from '../app-dispatcher';
import SimulationStore from '../stores/simulation-store';
//import SimulatorStore from '../stores/simulator-store';
import NodeStore from '../stores/node-store';
import UserStore from '../stores/user-store';
import NotificationsDataManager from '../data-managers/notifications-data-manager';

import Header from '../components/header';
import Footer from '../components/footer';
import SidebarMenu from '../components/menu-sidebar';
import Home from './home';

import '../styles/app.css';

class App extends Component {
  static getStores() {
    return [ NodeStore, UserStore, SimulationStore ];
  }

  static calculateState(prevState) {
    // get list of running simulators
    /*var simulators = SimulatorStore.getState().filter(simulator => {
      return simulator.running === true;
    });

    // check if running simulators changed
    if (prevState != null) {
      var equal = true;

      // compare each element with its old one
      if (prevState.runningSimulators.length === simulators.length) {
        equal = prevState.runningSimulators.every(oldSimulator => {
          const simulator = simulators.find(element => {
            return element._id === oldSimulator._id;
          });

          if (simulator == null) {
            return false;
          }

          return simulator.running === oldSimulator.running;
        });
      } else {
        equal = false;
      }

      // replace with old array to prevent change trigger
      if (equal) {
        simulators = prevState.runningSimulators;
      }
    }*/

    let currentUser = UserStore.getState().currentUser;

    return {
      nodes: NodeStore.getState(),
      currentRole: currentUser? currentUser.role : '',
      token: UserStore.getState().token/*,

      runningSimulators: simulators*/
    };
  }

  componentWillMount() {
    // if token stored locally, request user
    const token = localStorage.getItem('token');

    if (token != null && token !== '') {
      AppDispatcher.dispatch({
        type: 'users/logged-in',
        token: token
      });
    } else {
      // transition to login page
      this.props.router.push('/login');
    }

    // load all simulators and simulations to fetch simulation data
    AppDispatcher.dispatch({
      type: 'nodes/start-load'
    });

    AppDispatcher.dispatch({
      type: 'simulations/start-load'
    });
  }

  componentDidMount() {
    NotificationsDataManager.setSystem(this.refs.notificationSystem);
  }

  componentWillUpdate(nextProps, nextState) {
    // check if user is still logged in
    if (nextState.token == null) {
      // discard local token
      localStorage.setItem('token', '');

      this.props.router.push('/login');

      return;
    }

    // open connection to each required simulator
    const requiredSimulators = this.requiredSimulatorsBySimulations();

    requiredSimulators.forEach(simulator => {
      this.connectSimulator(nextState, simulator);
    });
  }

  requiredSimulatorsBySimulations() {
    return [];

    /*var simulators = [];

    this.state.simulations.forEach((simulation) => {
      simulation.models.forEach((simulationModel) => {
        // add simulator to list if not already part of
        const index = simulators.findIndex((element) => {
          return element.simulator === simulationModel.simulator;
        });

        if (index === -1) {
          simulators.push({ simulator: simulationModel.simulator, signals: simulationModel.length });
        } else {
          if (simulators[index].length < simulationModel.length) {
            simulators[index].length = simulationModel.length;
          }
        }
      });
    });

    return simulators;*/
  }

  /*connectSimulator(state, data) {
    // get simulator object
    const simulator = state.runningSimulators.find(element => {
      return element._id === data.simulator;
    });

    if (simulator != null) {
      AppDispatcher.dispatch({
        type: 'simulatorData/open',
        identifier: simulator._id,
        endpoint: simulator.endpoint,
        signals: data.signals
      });
    }
  }*/

  render() {
    // get children
    var children = this.props.children;
    if (this.props.location.pathname === "/") {
      children = <Home />
    }

    return (
      <div className="app">
        <NotificationSystem ref="notificationSystem" />

        <Header />

        <div className="app-body">
          <SidebarMenu currentRole={ this.state.currentRole }/>
          <div className="app-content">
            {children}
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Container.create(App));
