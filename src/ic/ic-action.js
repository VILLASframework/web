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
import { Button, DropdownButton, Dropdown, InputGroup, FormControl } from 'react-bootstrap';
import AppDispatcher from "../common/app-dispatcher";

class ICAction extends React.Component {
  constructor(props) {
    super(props);

    let t = new Date()

    Number.prototype.pad = function(size) {
        var s = String(this);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    }

    let time = new Date();
    time.setMinutes(5 * Math.round(time.getMinutes() / 5 + 1))

    this.state = {
      selectedAction: null,
      time: time
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.selectedAction == null) {
      if (props.actions != null && props.actions.length > 0) {
        return {
          selectedAction: props.actions[0]
        };
      }
    }

    return null
  }

  runAction(action, when) {

    console.log("configs", this.props.configs)
    console.log("selectedConfigs", this.props.selectedConfigs)
    console.log("ics", this.props.ics)
    console.log("selectedICs", this.props.selectedICs)
    console.log("action", action)
    console.log("when", when)

    if (action.data.action === 'none') {
      console.warn("No command selected. Nothing was sent.");
      return;
    }

    if (!this.props.hasConfigs){
      let newAction = {};
      newAction["action"] = action.data.action
      newAction["when"] = when

      for (let index of this.props.selectedICs) {
        let ic = this.props.ics[index];
        let icID = ic.id;

        /* VILLAScontroller protocol
        see: https://villas.fein-aachen.org/doc/controller-protocol.html

        RESET SHUTDOWN
        {
          "action": "reset/shutdown/stop/pause/resume"
          "when": "1234567"
        }

        DELETE
        {
          "action": "delete"
          "parameters":{
            "uuid": "uuid-of-the-manager-for-this-IC"
          }
          "when": "1234567"
        }

        CREATE is not possible within ICAction (see add IC)
        */

        if (newAction.action === "delete"){
          // prepare parameters for delete incl. correct IC id
          newAction["parameters"] = {};
          newAction.parameters["uuid"] = ic.id;
          icID = ic.manager; // send delete action to manager of IC
        }

        AppDispatcher.dispatch({
          type: 'ics/start-action',
          icid: ic.id,
          action: newAction,
          result: null,
          token: this.props.token
        });

      } // end for loop over selected ICs
    } else {

      /*VILLAScontoller protocol
      see: https://villas.fein-aachen.org/doc/controller-protocol.html
      *
      * STOP PAUSE RESUME
        {
          "action": "reset/shutdown/stop/pause/resume"
          "when": "1234567"
        }
      *
      * START
        {
          "action": "start"
          "when": 1234567
          "parameters": {
            Start parameters for this IC as configured in the component config
          }
          "model": {
            "type": "url"
            "url": "https://villas.k8s.eonerc.rwth-aachen.de/api/v2/files/{fileID}" where fileID is the model file configured in the component config
            "token": "asessiontoken"
          }
          "results":{
            "type": "url"
            "url" : "https://villas.k8s.eonerc.rwth-aachen.de/api/v2/results/{resultID}/file" where resultID is the ID of the result created for this run
            "token": "asessiontoken"
          }
        }
       *
      *
      * */


      let newActions = [];
      for (let config of this.props.selectedConfigs) {
        let newAction = {}
        newAction["action"] = action.data.action
        newAction["when"] = when

        // get IC for component config
        let ic = null;
        for (let component of this.props.ics) {
          if (component.id === config.icID) {
            ic = component;
          }
        }

        if (ic == null) {
          continue;
        }

        // the following is not required by the protocol; it is an internal help
        newAction["icid"] = ic.id

        if (newAction.action === 'start') {
          newAction["parameters"] = config.startParameters;
          newAction["model"] = {}

          if (config.fileIDs.length > 0){
            newAction.model["type"] = "url"
            newAction.model["token"] = this.props.token
            // TODO do not default to the first file of the config
            newAction.model["url"] = "/files/" + config.fileIDs[0].toString()
          }

          newAction["results"] = {}
          newAction.results["type"] = "url"
          newAction.results["token"] = this.props.token
          newAction.results["url"] = "/results/RESULTID/file" // RESULTID serves as placeholder and is replaced later

        }

        // add the new action
        newActions.push(newAction);
        console.log("New actions in loop", newAction, newActions)

      } // end for loop over selected configs


      let newResult = {}
      newResult["result"] = {}
      if (action.data.action === 'start') {

        let configSnapshots = [];
        // create config snapshots in case action is start
        for (let config of this.props.selectedConfigs) {
          let index = this.props.configs.indexOf(config)
          configSnapshots.push(this.props.snapshotConfig(index));
        }

        // create new result for new run
        newResult.result["description"] = "Placeholder for description"
        newResult.result["scenarioID"] = this.props.selectedConfigs[0].scenarioID
        newResult.result["configSnapshots"] = configSnapshots
      }


      console.log("Dispatching actions for configs", newActions, newResult)
      AppDispatcher.dispatch({
        type: 'ics/start-action',
        action: newActions,
        result: newResult,
        token: this.props.token
      });
    }
  }

  setAction = id => {
    // search action
    for (let action of this.props.actions) {
      if (action.id === id) {
        this.setState({ selectedAction: action });
      }
    }
  };

  setTimeForAction = (time) => {
    this.setState({ time: new Date(time) })
  }

  render() {

    let sendCommandDisabled = false;
    if (!this.props.hasConfigs && this.props.selectedICs.length === 0 || this.state.selectedAction == null || this.state.selectedAction.id === "-1"){
      sendCommandDisabled = true;
    }
    if (this.props.hasConfigs && this.props.selectedConfigs.length === 0|| this.state.selectedAction == null || this.state.selectedAction.id === "-1"){
      sendCommandDisabled = true;
    }

    let time = this.state.time.getFullYear().pad(4) + '-' +
               this.state.time.getMonth().pad(2) + '-' +
               this.state.time.getDay().pad(2) + 'T' +
               this.state.time.getHours().pad(2) + ':' +
               this.state.time.getMinutes().pad(2);

    const actionList = this.props.actions.map(action => (
      <Dropdown.Item key={action.id} eventKey={action.id} active={this.state.selectedAction === action.id}>
        {action.title}
      </Dropdown.Item>
    ));

    return <div className='solid-button'>
      <InputGroup>
        <InputGroup.Prepend>
          <DropdownButton
            variant="secondary"
            title={this.state.selectedAction != null ? this.state.selectedAction.title : ''}
            id="action-dropdown"
            onSelect={this.setAction}>
            {actionList}
          </DropdownButton>
          <FormControl
            type="datetime-local"
            variant="outline-secondary"
            value={time}
            onChange={this.setTimeForAction} />
        </InputGroup.Prepend>
        <Button
          variant="secondary"
          disabled={sendCommandDisabled}
          onClick={() => this.runAction(this.state.selectedAction, this.state.time)}>Run</Button>
      </InputGroup>
      <small className="text-muted">Select time for synced command execution</small>
    </div>;
  }
}

export default ICAction;
