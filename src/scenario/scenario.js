/**
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

import AppDispatcher from '../common/app-dispatcher';
import IconButton from '../common/icon-button';
import IconToggleButton from '../common/icon-toggle-button';

import ScenarioStore from './scenario-store';
import ICStore from '../ic/ic-store';
import DashboardStore from '../dashboard/dashboard-store';
import ConfigStore from '../componentconfig/config-store';
import SignalStore from '../signal/signal-store'
import FileStore from "../file/file-store"
import WidgetStore from "../widget/widget-store";
import ResultStore from "../result/result-store"

import DashboardTable from '../dashboard/dashboard-table'
import ResultTable from "../result/result-table";
import ConfigTable from "../componentconfig/config-table";
import EditFilesDialog from '../file/edit-files'
import ScenarioUsersTable from "./scenario-users-table";


class Scenario extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filesEditModal: false,
      filesEditSaveState:  [],
    }
  }

  static calculateState(prevState, props){
    let scenarioID = parseInt(props.match.params.scenario, 10)

      return{
        sessionToken: localStorage.getItem("token"),
        scenario: ScenarioStore.getState().find(s => s.id === scenarioID),
        results: ResultStore.getState().filter(result => result.scenarioID === scenarioID),
        sessionToken: localStorage.getItem("token"),
        configs: ConfigStore.getState().filter(config => config.scenarioID === scenarioID),
        widgets: WidgetStore.getState(),
        dashboards: DashboardStore.getState().filter(dashb => dashb.scenarioID === scenarioID),
        signals: SignalStore.getState(),
        currentUser: JSON.parse(localStorage.getItem("currentUser")),
        files: FileStore.getState().filter(file => file.scenarioID === scenarioID),
        ics: ICStore.getState(),
      }
  }

  static getStores() {
    return [ScenarioStore, ConfigStore, DashboardStore, ICStore, SignalStore, FileStore, WidgetStore, ResultStore];
  }

  componentDidMount() {
    let scenarioID = parseInt(this.props.match.params.scenario, 10)
    //load selected scenario
    AppDispatcher.dispatch({
      type: 'scenarios/start-load',
      data: scenarioID,
      token: this.state.sessionToken
    });

    AppDispatcher.dispatch({
      type: 'scenarios/start-load-users',
      data: scenarioID,
      token: this.state.sessionToken
    });

    // load ICs to enable that component configs and dashboards work with them
    AppDispatcher.dispatch({
      type: 'ics/start-load',
      token: this.state.sessionToken
    });
  }

  /* ##############################################
  * File modification methods
  ############################################## */

  onEditFiles() {
    let tempFiles = [];
    this.state.files.forEach(file => {
      tempFiles.push({
        id: file.id,
        name: file.name
      });
    })
    this.setState({ filesEditModal: true, filesEditSaveState: tempFiles });
  }

  closeEditFiles() {
    this.setState({ filesEditModal: false });
  }

  /* ##############################################
  * Change locked state of scenario
  ############################################## */

  onChangeLock() {
    let data = {};
    data.id = this.state.scenario.id;
    data.isLocked = !this.state.scenario.isLocked;

    AppDispatcher.dispatch({
      type: 'scenarios/start-edit',
      data,
      token: this.state.sessionToken
    });
  }

  /* ##############################################
  * Render method
  ############################################## */

  render() {

    const tableHeadingStyle = {
      paddingTop: '30px'
    }

    if (this.state.scenario === undefined) {
      return <h1>Loading Scenario...</h1>;
    }

    let tooltip = this.state.scenario.isLocked ? "View files of scenario" : "Add, edit or delete files of scenario";

    return <div className='section'>
      <div className='section-buttons-group-right'>
        <IconButton
          ikey="0"
          tooltip={tooltip}
          onClick={this.onEditFiles.bind(this)}
          icon="file"
        />
      </div>
      <h1>
        {this.state.scenario.name}
        <span className='icon-button'>
              <IconToggleButton
                ikey={0}
                onChange={() => this.onChangeLock()}
                checked={this.state.scenario.isLocked}
                checkedIcon='lock'
                uncheckedIcon='lock-open'
                tooltipChecked='Scenario is locked, cannot be edited'
                tooltipUnchecked='Scenario is unlocked, can be edited'
                disabled={this.state.currentUser.role !== "Admin"}
              />
            </span>
        </h1>

      <EditFilesDialog
        sessionToken={this.state.sessionToken}
        show={this.state.filesEditModal}
        onClose={this.closeEditFiles.bind(this)}
        signals={this.state.signals}
        files={this.state.files}
        scenarioID={this.state.scenario.id}
        locked={this.state.scenario.isLocked}
      />

      <ConfigTable
        configs={this.state.configs}
        files={this.state.files}
        ics={this.state.ics}
        signals={this.state.signals}
        scenario={this.state.scenario}
        sessionToken={this.state.sessionToken}
        currentUser={this.state.currentUser}
        tableHeadingStyle={tableHeadingStyle}
        locked={this.state.scenario.isLocked}
      />

      <DashboardTable
        dashboards={this.state.dashboards}
        widgets={this.state.widgets}
        scenario={this.state.scenario}
        sessionToken={this.state.sessionToken}
        currentUser={this.state.currentUser}
        tableHeadingStyle={tableHeadingStyle}
        locked={this.state.scenario.isLocked}
      />

      <ResultTable
        results={this.state.results}
        files={this.state.files}
        scenario={this.state.scenario}
        sessionToken={this.state.sessionToken}
        tableHeadingStyle={tableHeadingStyle}
        locked={this.state.scenario.isLocked}
      />

      <ScenarioUsersTable
        scenario={this.state.scenario}
        currentUser={this.state.currentUser}
        sessionToken={this.state.sessionToken}
        tableHeadingStyle={tableHeadingStyle}
        locked={this.state.scenario.isLocked}
      />

    </div>
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Scenario), { withProps: true });
