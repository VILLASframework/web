/**
 * File: app.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import AppDispatcher from '../app-dispatcher';
import SimulationStore from '../stores/simulation-store';
import SimulatorStore from '../stores/simulator-store';
import UserStore from '../stores/user-store';

import Header from '../components/header';
import Footer from '../components/footer';
import SidebarMenu from '../components/menu-sidebar';
import Home from './home';

import '../styles/app.css';

class App extends Component {
  static getStores() {
    return [ SimulationStore, SimulatorStore, UserStore ];
  }

  static calculateState(prevState) {
    // get list of running simulators
    var simulators = SimulatorStore.getState().filter(simulator => {
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
    }

    return {
      simulations: SimulationStore.getState(),
      currentUser: UserStore.getState().currentUser,

      runningSimulators: simulators
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
      type: 'simulators/start-load'
    });

    AppDispatcher.dispatch({
      type: 'simulations/start-load'
    });
  }

  componentWillUpdate(nextProps, nextState) {
    // check if user is still logged in
    if (UserStore.getState().token == null) {
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
    var simulators = [];

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

    return simulators;
  }

  connectSimulator(state, data) {
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
  }

  render() {
    // get children
    var children = this.props.children;
    if (this.props.location.pathname === "/") {
      children = <Home />
    }

    return (
      <div className="app">
        <Header />
        <SidebarMenu />

        <div className="app-content">
          {children}
        </div>

        <Footer />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Container.create(App));
