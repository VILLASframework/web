/**
 * File: simulators.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Container } from 'flux/utils';

import AppDispatcher from '../app-dispatcher';
import VillasStore from '../stores/villas-store';
import SimulatorStore from '../stores/simulator-store';

import Table from '../components/table';
import '../styles/projects.css';

class Simulators extends Component {
  static getStores() {
    return [ VillasStore, SimulatorStore ];
  }

  static calculateState() {
    return {
      villas: VillasStore.getState(),
      simulators: SimulatorStore.getState(),

      onButton
    };
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'simulators/start-load'
    });
  }

  render() {
    var columns = [
      { title: 'Name', key: 'name' },
      { title: 'ID', key: 'simulatorid', width: 80 },
      { title: 'Running', key: 'running', width: 80 },
      { title: 'Endpoint', key: 'endpoint', width: 120 }
    ];

    return (
      <div>
        <h1>Simulators</h1>

        <Table columns={columns} data={this.state.simulators} width='100%'/>

        <button onClick={onButton}>New Simulator</button>
      </div>
    );
  }
}

function onButton() {
  AppDispatcher.dispatch({
    type: 'simulators/start-add',
    simulator: {
      name: 'Virtual',
      running: false,
      simulatorid: 3,
      endpoint: '1.1.1.1:1234'
    }
  });
}

export default Container.create(Simulators);
