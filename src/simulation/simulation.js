/**
 * File: simulation.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
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
import { Button } from 'react-bootstrap';
import FileSaver from 'file-saver';
import _ from 'lodash';

import SimulationStore from './simulation-store';
import SimulatorStore from '../simulator/simulator-store';
import SimulationModelStore from '../simulationmodel/simulation-model-store';
import LoginStore from '../user/login-store';
import AppDispatcher from '../common/app-dispatcher';

import Icon from '../common/icon';
import Table from '../common/table';
import TableColumn from '../common/table-column';
import ImportSimulationModelDialog from '../simulationmodel/import-simulation-model';

import SimulatorAction from '../simulator/simulator-action';
import DeleteDialog from '../common/dialogs/delete-dialog';

class Simulation extends React.Component {
  static getStores() {
    return [ SimulationStore, SimulatorStore, SimulationModelStore, LoginStore ];
  }

  static calculateState(prevState, props) {
    // get selected simulation
    const sessionToken = LoginStore.getState().token;

    let simulation = SimulationStore.getState().find(s => s._id === props.match.params.simulation);
    if (simulation == null) {
      AppDispatcher.dispatch({
        type: 'simulations/start-load',
        data: props.match.params.simulation,
        token: sessionToken
      });

      simulation = {};
    }

    // load models
    let simulationModels = [];
    if (simulation.models != null) {
      simulationModels = SimulationModelStore.getState().filter(m => m != null && simulation.models.includes(m._id));
    }

    return {
      simulationModels,
      simulation,

      simulators: SimulatorStore.getState(),
      sessionToken,

      deleteModal: false,
      importModal: false,
      modalData: {},

      selectedSimulationModels: []
    }
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'simulations/start-load',
      token: this.state.sessionToken
    });

    AppDispatcher.dispatch({
      type: 'simulationModels/start-load',
      token: this.state.sessionToken
    });

    AppDispatcher.dispatch({
      type: 'simulators/start-load',
      token: this.state.sessionToken
    });
  }

  addSimulationModel = () => {
    const simulationModel = {
      simulation: this.state.simulation._id,
      name: 'New Simulation Model',
      simulator: this.state.simulators.length > 0 ? this.state.simulators[0].id : null,
      outputLength: 1,
      outputMapping: [{ name: 'Signal', type: 'Type' }],
      inputLength: 1,
      inputMapping: [{ name: 'Signal', type: 'Type' }]
    };

    AppDispatcher.dispatch({
      type: 'simulationModels/start-add',
      data: simulationModel,
      token: this.state.sessionToken
    });

    this.setState({ simulation: {} }, () => {
      AppDispatcher.dispatch({
        type: 'simulations/start-load',
        data: this.props.match.params.simulation,
        token: this.state.sessionToken
      });
    });
  }

  closeDeleteModal = confirmDelete => {
    this.setState({ deleteModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'simulationModels/start-remove',
      data: this.state.modalData,
      token: this.state.sessionToken
    });
  }

  importSimulationModel = simulationModel => {
    this.setState({ importModal: false });

    if (simulationModel == null) {
      return;
    }

    simulationModel.simulation = this.state.simulation._id;

    console.log(simulationModel);

    AppDispatcher.dispatch({
      type: 'simulationModels/start-add',
      data: simulationModel,
      token: this.state.sessionToken
    });

    this.setState({ simulation: {} }, () => {
      AppDispatcher.dispatch({
        type: 'simulations/start-load',
        data: this.props.match.params.simulation,
        token: this.state.sessionToken
      });
    });
  }

  getSimulatorName(simulatorId) {
    for (let simulator of this.state.simulators) {
      if (simulator.id === simulatorId) {
        return _.get(simulator, 'properties.name') || _.get(simulator, 'rawProperties.name') ||  simulator.uuid;
      }
    }
  }

  exportModel(index) {
    // filter properties
    const model = Object.assign({}, this.state.simulationModels[index]);

    delete model.simulator;
    delete model.simulation;

    // show save dialog
    const blob = new Blob([JSON.stringify(model, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'simulation model - ' + model.name + '.json');
  }

  onSimulationModelChecked(index, event) {
    const selectedSimulationModels = Object.assign([], this.state.selectedSimulationModels);
    for (let key in selectedSimulationModels) {
      if (selectedSimulationModels[key] === index) {
        // update existing entry
        if (event.target.checked) {
          return;
        }

        selectedSimulationModels.splice(key, 1);

        this.setState({ selectedSimulationModels });
        return;
      }
    }

    // add new entry
    if (event.target.checked === false) {
      return;
    }

    selectedSimulationModels.push(index);
    this.setState({ selectedSimulationModels });
  }

  runAction = action => {
    for (let index of this.state.selectedSimulationModels) {
      // get simulator for model
      let simulator = null;
      for (let sim of this.state.simulators) {
        if (sim._id === this.state.simulationModels[index].simulator) {
          simulator = sim;
        }
      }

      if (simulator == null) {
        continue;
      }

      if (action.data.action === 'start') {
        action.data.parameters = this.state.simulationModels[index].startParameters;
      }

      AppDispatcher.dispatch({
        type: 'simulators/start-action',
        simulator,
        data: action.data,
        token: this.state.sessionToken
      });
    }
  }

  render() {
    const buttonStyle = {
      marginLeft: '10px'
    };

    return <div className='section'>
      <h1>{this.state.simulation.name}</h1>

      <Table data={this.state.simulationModels}>
        <TableColumn checkbox onChecked={(index, event) => this.onSimulationModelChecked(index, event)} width='30' />
        <TableColumn title='Name' dataKey='name' link='/simulationModel/' linkKey='_id' />
        <TableColumn title='Simulator' dataKey='simulator' modifier={(simulator) => this.getSimulatorName(simulator)} />
        <TableColumn title='Output' dataKey='outputLength' width='100' />
        <TableColumn title='Input' dataKey='inputLength' width='100' />
        <TableColumn
          title=''
          width='70'
          deleteButton
          exportButton
          onDelete={(index) => this.setState({ deleteModal: true, modalData: this.state.simulationModels[index], modalIndex: index })}
          onExport={index => this.exportModel(index)}
        />
      </Table>

      <div style={{ float: 'left' }}>
        <SimulatorAction
          runDisabled={this.state.selectedSimulationModels.length === 0}
          runAction={this.runAction}
          actions={[
            { id: '0', title: 'Start', data: { action: 'start' } },
            { id: '1', title: 'Stop', data: { action: 'stop' } },
            { id: '2', title: 'Pause', data: { action: 'pause' } },
            { id: '3', title: 'Resume', data: { action: 'resume' } }
          ]}/>
      </div>

      <div style={{ float: 'right' }}>
        <Button onClick={this.addSimulationModel} style={buttonStyle}><Icon icon="plus" /> Simulation Model</Button>
        <Button onClick={() => this.setState({ importModal: true })} style={buttonStyle}><Icon icon="upload" /> Import</Button>
      </div>

      <div style={{ clear: 'both' }} />

      <ImportSimulationModelDialog show={this.state.importModal} onClose={this.importSimulationModel} simulators={this.state.simulators} />

      <DeleteDialog title="simulation model" name={this.state.modalData.name} show={this.state.deleteModal} onClose={this.closeDeleteModal} />
    </div>;
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Simulation), { withProps: true });
