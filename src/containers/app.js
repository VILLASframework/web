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

  static calculateState() {
    return {
      simulators: SimulatorStore.getState(),
      simulations: SimulationStore.getState(),
      currentUser: UserStore.getState().currentUser
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

  componentDidUpdate() {
    if (this.state.simulators && this.state.simulations && this.state.simulations.length > 0) {
      // get list of used simulators
      var simulators = [];

      this.state.simulations.forEach((simulation) => {
        // open connection to each simulator running a simulation model
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

      // open connection to each simulator
      this.state.simulators.forEach((simulator) => {
        const index = simulators.findIndex((element) => {
          return element.simulator === simulator._id;
        });

        if (index !== -1) {
          AppDispatcher.dispatch({
            type: 'simulatorData/open',
            identifier: simulator._id,
            endpoint: simulator.endpoint,
            signals: simulators[index].signals
          });
        }
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
