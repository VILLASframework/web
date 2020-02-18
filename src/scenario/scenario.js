/**
 * File: scenario.js
 * Author: Sonja Happ <sonja.happ@eonerc.rwth-aachen.de>
 * Date: 20.08.2019
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

import ScenarioStore from './scenario-store';
import SimulatorStore from '../simulator/simulator-store';
import DashboardStore from '../dashboard/dashboard-store';
import SimulationModelStore from '../simulationmodel/simulation-model-store';
import LoginStore from '../user/login-store';
import SignalStore from '../signal/signal-store'
import AppDispatcher from '../common/app-dispatcher';

import Icon from '../common/icon';
import Table from '../common/table';
import TableColumn from '../common/table-column';
import ImportSimulationModelDialog from '../simulationmodel/import-simulation-model';
import ImportDashboardDialog from "../dashboard/import-dashboard";
import NewDashboardDialog from "../dashboard/new-dashboard";

import SimulatorAction from '../simulator/simulator-action';
import DeleteDialog from '../common/dialogs/delete-dialog';
import EditSimulationModelDialog from "../simulationmodel/edit-simulation-model";
import EditSignalMapping from "../signal/edit-signal-mapping";

class Scenario extends React.Component {
  static getStores() {
    return [ ScenarioStore, SimulationModelStore, DashboardStore, SimulatorStore, LoginStore, SignalStore];
  }

  static calculateState(prevState, props) {
    // get selected scenario
    const sessionToken = LoginStore.getState().token;

    const scenario = ScenarioStore.getState().find(s => s.id === parseInt(props.match.params.scenario, 10));
    if (scenario == null) {
      AppDispatcher.dispatch({
        type: 'scenarios/start-load',
        data: props.match.params.scenario,
        token: sessionToken
      });
    }

    // obtain all dashboards of a scenario
    let dashboards = DashboardStore.getState().filter(dashb => dashb.scenarioID === parseInt(props.match.params.scenario, 10));

    // obtain all simulation models of a scenario
    let simulationModels = SimulationModelStore.getState().filter(simmodel => simmodel.scenarioID === parseInt(props.match.params.scenario, 10));

    let signals = SignalStore.getState();


    return {
      scenario,
      sessionToken,
      simulationModels,
      dashboards,
      signals,
      simulators: SimulatorStore.getState(),

      deleteSimulationModelModal: false,
      importSimulationModelModal: false,
      editSimulationModelModal: false,
      modalSimulationModelData: {},
      selectedSimulationModels: [],
      modalSimulationModelIndex: 0,

      editOutputSignalsModal: false,
      editInputSignalsModal: false,

      newDashboardModal: false,
      deleteDashboardModal: false,
      importDashboardModal: false,
      modalDashboardData: {},
    }
  }

  componentDidMount() {

    //load selected scenario
    AppDispatcher.dispatch({
      type: 'scenarios/start-load',
      data: this.state.scenario.id,
      token: this.state.sessionToken
    });

    // load simulation models for selected scenario
    AppDispatcher.dispatch({
      type: 'simulationModels/start-load',
      token: this.state.sessionToken,
      param: '?scenarioID='+this.state.scenario.id,
    });

    // load dashboards of selected scenario
    AppDispatcher.dispatch({
      type: 'dashboards/start-load',
      token: this.state.sessionToken,
      param: '?scenarioID='+this.state.scenario.id,
    });

    // load simulators to enable that simulation models work with them
    AppDispatcher.dispatch({
      type: 'simulators/start-load',
      token: this.state.sessionToken,
    });


  }

  static getDerivedStateFromProps(props, state){

    let simulationModels = SimulationModelStore.getState().filter(simmodel => simmodel.scenarioID === parseInt(props.match.params.scenario, 10));

    return {
      simulationModels: simulationModels
    };
  }

  addSimulationModel(){
    const simulationModel = {
      scenarioID: this.state.scenario.id,
      name: 'New Simulation Model',
      simulatorID: this.state.simulators.length > 0 ? this.state.simulators[0].id : null,
      startParameters: {},
    };

    AppDispatcher.dispatch({
      type: 'simulationModels/start-add',
      data: simulationModel,
      token: this.state.sessionToken
    });

    this.setState({ scenario: {} }, () => {
      AppDispatcher.dispatch({
        type: 'scenarios/start-load',
        data: this.props.match.params.scenario,
        token: this.state.sessionToken
      });
    });
  }

  closeEditSimulationModelModal(data){
    this.setState({ editSimulationModelModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'simulationModels/start-edit',
        data: data,
        token: this.state.sessionToken,
      });
    }
  }

  closeDeleteSignalModal(data){
      // data contains the signal to be deleted
      if (data){

        AppDispatcher.dispatch({
          type: 'signals/start-remove',
          data: data,
          token: this.state.sessionToken
        });

      }
  }

  closeNewSignalModal(data){
      //data contains the new signal incl. simulationModelID and direction
      if (data) {
        AppDispatcher.dispatch({
          type: 'signals/start-add',
          data: data,
          token: this.state.sessionToken
        });
      }
  }

  closeEditSignalsModal(data, direction){

    if( direction === "in") {
      this.setState({editInputSignalsModal: false});
    } else if( direction === "out"){
      this.setState({editOutputSignalsModal: false});
    } else {
      return; // no valid direction
    }

    if (data){
      //data is an array of signals
      for (let sig of data) {
        //dispatch changes to signals
        AppDispatcher.dispatch({
          type: 'signals/start-edit',
          data: sig,
          token: this.state.sessionToken,
        });
      }
    }

  }

  closeDeleteSimulationModelModal(confirmDelete) {
    this.setState({ deleteSimulationModelModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'simulationModels/start-remove',
      data: this.state.modalSimulationModelData,
      token: this.state.sessionToken
    });
  }

  importSimulationModel(simulationModel){
    this.setState({ importSimulationModelModal: false });

    if (simulationModel == null) {
      return;
    }

    simulationModel.scenario = this.state.scenario.id;

    AppDispatcher.dispatch({
      type: 'simulationModels/start-add',
      data: simulationModel,
      token: this.state.sessionToken
    });

    this.setState({ scenario: {} }, () => {
      AppDispatcher.dispatch({
        type: 'scenarios/start-load',
        data: this.props.match.params.scenario,
        token: this.state.sessionToken
      });
    });
  }

  closeNewDashboardModal(data) {
    this.setState({ newDashboardModal : false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'dashboards/start-add',
        data,
        token: this.state.sessionToken,
      });
    }
  }

  closeDeleteDashboardModal(confirmDelete){
    this.setState({ deleteDashboardModal: false });

    if (confirmDelete === false) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'dashboards/start-remove',
      data: this.state.modalDashboardData,
      token: this.state.sessionToken,
    });
  }

  closeImportDashboardModal(data) {
    this.setState({ importDashboardModal: false });

    if (data) {
      AppDispatcher.dispatch({
        type: 'dashboards/start-add',
        data,
        token: this.state.sessionToken,
      });
    }
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

    //delete model.simulator;
    //delete model.scenario;
    // TODO get elements recursively

    // show save dialog
    const blob = new Blob([JSON.stringify(model, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'simulation model - ' + model.name + '.json');
  }

  exportDashboard(index) {
    // filter properties
    const dashboard = Object.assign({}, this.state.dashboards[index]);

    // TODO get elements recursively

    // show save dialog
    const blob = new Blob([JSON.stringify(dashboard, null, 2)], { type: 'application/json' });
    FileSaver.saveAs(blob, 'dashboard - ' + dashboard.name + '.json');
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
      <h1>{this.state.scenario.name}</h1>

      {/*Simulation Model table*/}
      <h2>Simulation Models</h2>
      <Table data={this.state.simulationModels}>
        <TableColumn checkbox onChecked={(index, event) => this.onSimulationModelChecked(index, event)} width='30' />
        <TableColumn title='Name' dataKey='name' />
        <TableColumn
          title='# Output Signals'
          dataKey='outputLength'
          editButton
          onEdit={index => this.setState({ editOutputSignalsModal: true, modalSimulationModelData: this.state.simulationModels[index], modalSimulationModelIndex: index })}
        />
        <TableColumn
          title='# Input Signals'
          dataKey='inputLength'
          editButton
          onEdit={index => this.setState({ editInputSignalsModal: true, modalSimulationModelData: this.state.simulationModels[index], modalSimulationModelIndex: index })}
        />
        <TableColumn title='Simulator' dataKey='simulatorID' modifier={(simulatorID) => this.getSimulatorName(simulatorID)} />
        <TableColumn
          title='Edit/ Delete/ Export'
          width='200'
          editButton
          deleteButton
          exportButton
          onEdit={index => this.setState({ editSimulationModelModal: true, modalSimulationModelData: this.state.simulationModels[index], modalSimulationModelIndex: index })}
          onDelete={(index) => this.setState({ deleteSimulationModelModal: true, modalSimulationModelData: this.state.simulationModels[index], modalSimulationModelIndex: index })}
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
        <Button onClick={() => this.addSimulationModel()} style={buttonStyle}><Icon icon="plus" /> Simulation Model</Button>
        <Button onClick={() => this.setState({ importSimulationModelModal: true })} style={buttonStyle}><Icon icon="upload" /> Import</Button>
      </div>

      <div style={{ clear: 'both' }} />

      <EditSimulationModelDialog show={this.state.editSimulationModelModal} onClose={data => this.closeEditSimulationModelModal(data)} simulationModel={this.state.modalSimulationModelData} simulators={this.state.simulators} />
      <ImportSimulationModelDialog show={this.state.importSimulationModelModal} onClose={data => this.importSimulationModel(data)} simulators={this.state.simulators} />
      <DeleteDialog title="simulation model" name={this.state.modalSimulationModelData.name} show={this.state.deleteSimulationModelModal} onClose={(c) => this.closeDeleteSimulationModelModal(c)} />

      <EditSignalMapping
        show={this.state.editOutputSignalsModal}
        onCloseEdit={(data, direction) => this.closeEditSignalsModal(data, direction)}
        onAdd={(data) => this.closeNewSignalModal(data)}
        onDelete={(data) => this.closeDeleteSignalModal(data)}
        direction="Output"
        signals={this.state.signals}
        simulationModelID={this.state.modalSimulationModelData.id} />
      <EditSignalMapping
        show={this.state.editInputSignalsModal}
        onCloseEdit={(data, direction) => this.closeEditSignalsModal(data, direction)}
        onAdd={(data) => this.closeNewSignalModal(data)}
        onDelete={(data) => this.closeDeleteSignalModal(data)}
        direction="Input"
        signals={this.state.signals}
        simulationModelID={this.state.modalSimulationModelData.id}/>

      {/*Dashboard table*/}
      <h2>Dashboards</h2>
      <Table data={this.state.dashboards}>
        <TableColumn title='Name' dataKey='name' link='/dashboards/' linkKey='id' />
        <TableColumn title='Grid' dataKey='grid' />
        <TableColumn
          title=''
          width='200'
          deleteButton
          exportButton
          onDelete={(index) => this.setState({ deleteDashboardModal: true, modalDashboardData: this.state.dashboards[index], modalDashboardIndex: index })}
          onExport={index => this.exportDashboard(index)}
        />
      </Table>

      <div style={{ float: 'right' }}>
        <Button onClick={() => this.setState({ newDashboardModal: true })} style={buttonStyle}><Icon icon="plus" /> Dashboard</Button>
        <Button onClick={() => this.setState({ importDashboardModal: true })} style={buttonStyle}><Icon icon="upload" /> Import</Button>
      </div>

      <div style={{ clear: 'both' }} />

      <NewDashboardDialog show={this.state.newDashboardModal} onClose={data => this.closeNewDashboardModal(data)}/>
      <ImportDashboardDialog show={this.state.importDashboardModal} onClose={data => this.closeImportDashboardModal(data)}  />

      <DeleteDialog title="dashboard" name={this.state.modalDashboardData.name} show={this.state.deleteDashboardModal} onClose={(e) => this.closeDeleteDashboardModal(e)}/>


    </div>;
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Scenario), { withProps: true });
