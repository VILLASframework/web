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
import NotificationsFactory from "../common/data-managers/notifications-factory";
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";

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
    if (action.data.action === 'none') {
      console.warn("No command selected. Nothing was sent.");
      return;
    }

    if (!this.props.hasConfigs) {
      let newAction = {};
      newAction["action"] = action.data.action
      newAction["when"] = when

      for (let index of this.props.selectedICs) {
        let ic = this.props.ics[index];
        let icID = ic.id;

        /* VILLAScontroller protocol
         * see: https://villas.fein-aachen.org/doc/controller-protocol.html
         */

        if (newAction.action == "create" || newAction.action === "delete") {
          // prepare parameters for delete incl. correct IC id
          newAction["parameters"] = {};

          if (newAction.action == "delete") {
            newAction.parameters["uuid"] = ic.uuid;
          }
          else if (newAction.action == "create") {
            newAction.parameters = ic.statusupdateraw.properties;
          }

          // get the ID of the manager IC
          let managerIC = null;
          for (let i of this.props.ics) {
            if (i.uuid === ic.manager) {
              managerIC = i;
            }
          }

          if (managerIC == null) {
            NotificationsDataManager.addNotification(NotificationsFactory.DELETE_ERROR("Could not find manager IC with UUID " + ic.manager));
            continue;
          }

          icID = managerIC.id; // send delete action to manager of IC
        }

        AppDispatcher.dispatch({
          type: 'ics/start-action',
          icid: icID,
          action: newAction,
          result: null,
          token: this.props.token
        });

      } // end for loop over selected ICs
    } else {
      /* VILLAScontoller protocol
       * see: https://villas.fein-aachen.org/doc/controller-protocol.html
       */

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

          if (config.fileIDs && config.fileIDs.length > 0) {
            newAction["model"] = {}
            newAction.model["type"] = "url-list"
            newAction.model["token"] = this.props.token

            let fileURLs = []
            for (let fileID of config.fileIDs) {
              fileURLs.push("/files/" + fileID.toString())
            }
            newAction.model["url"] = fileURLs
          }

          newAction["results"] = {}
          newAction.results["type"] = "url"
          newAction.results["token"] = this.props.token
          newAction.results["url"] = "/results/RESULTID/file" // RESULTID serves as placeholder and is replaced later
        }

        // add the new action
        newActions.push(newAction);

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
        newResult.result["description"] = "Start at " + when;
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
    if (!this.props.hasConfigs && this.props.selectedICs.length === 0 || this.state.selectedAction == null || this.state.selectedAction.id === "-1") {
      sendCommandDisabled = true;
    }
    if (this.props.hasConfigs && this.props.selectedConfigs.length === 0|| this.state.selectedAction == null || this.state.selectedAction.id === "-1") {
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
