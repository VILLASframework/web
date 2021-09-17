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

import AppDispatcher from "../common/app-dispatcher";
import NotificationsFactory from "../common/data-managers/notifications-factory";
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";


/* VILLAScontoller protocol
* see: https://villas.fein-aachen.org/doc/controller-protocol.html
*/
class ICAction {

  dispatchActionForIC(action, icID, token, result = null) {
    AppDispatcher.dispatch({
      type: 'ics/start-action',
      icid: icID,
      action: action,
      result: result,
      token: token
    });
  }

  reset(icID, time, token) {
    let newAction = {};
    newAction['action'] = 'reset'
    newAction['when'] = time

    this.dispatchActionForIC(newAction, icID, token)
  }

  shutdown(icID, time, token) {
    let newAction = {};
    newAction['action'] = 'shutdown'
    newAction['when'] = time

    this.dispatchActionForIC(newAction, icID, token)
  }

  dispatchActionForManagedIC(action, ic, managerIC, token) {
    if (managerIC == null) {
      NotificationsDataManager.addNotification(NotificationsFactory.DELETE_ERROR("Could not find manager IC with UUID " + ic.manager));
      return;
    }

    let icID = managerIC.id; // send action to manager of IC
    action['parameters'] = {};

    if (action.action === 'delete') {
      action.parameters['uuid'] = ic.uuid;
    }
    else if (action.action === 'create') {
      action.parameters = ic.statusupdateraw.properties;
    }

    AppDispatcher.dispatch({
      type: 'ics/start-action',
      icid: icID,
      action: action,
      result: null,
      token: token
    });
  }

  deleteIC(ic, managerIC, time, token) {
    let newAction = {};
    newAction['action'] = 'delete'
    newAction['when'] = time

    this.dispatchActionForManagedIC(newAction, ic, managerIC, token)
  }

  recreate(ic, managerIC, time, token) {
    let newAction = {};
    newAction['action'] = 'create'
    newAction['when'] = time

    this.dispatchActionForManagedIC(newAction, ic, managerIC, token)
  }

  start(configs, configSnapshots, ics, time, token, doCreateResult = false) {
    let newActions = [];
    for (let config of configs) {
      let newAction = {}
      newAction['action'] = 'start'
      newAction['when'] = time

      // get IC for component config
      let ic = null;
      for (let component of ics) {
        if (component.id === config.icID) {
          ic = component;
        }
      }

      if (ic == null) {
        continue;
      }

      // the following is not required by the protocol; it is an internal help
      newAction["icid"] = ic.id
      newAction["parameters"] = config.startParameters;

      if (config.fileIDs && config.fileIDs.length > 0) {
        newAction["model"] = {}
        newAction.model["type"] = "url-list"
        newAction.model["token"] = token

        let fileURLs = []
        for (let fileID of config.fileIDs) {
          fileURLs.push("/files/" + fileID.toString())
        }
        newAction.model["url"] = fileURLs
      }

      if (doCreateResult) {
        newAction["results"] = {}
        newAction.results["type"] = "url"
        newAction.results["token"] = token
        // RESULTID serves as placeholder and is replaced later
        newAction.results["url"] = "/results/RESULTID/file"
      }

      // add the new action
      newActions.push(newAction);
    }

    // create new result for new run
    let newResult = null
    if (doCreateResult) {
      newResult = {}
      newResult["result"] = {}

      newResult.result["description"] = "Start at " + time;
      newResult.result["scenarioID"] = configs[0].scenarioID
      newResult.result["configSnapshots"] = configSnapshots
    }

    console.log("Dispatching actions for configs", newActions, newResult)
    AppDispatcher.dispatch({
      type: 'ics/start-action',
      action: newActions,
      result: newResult,
      token: token
    });
  }

  dispatchActionsForMultipleICs(actiontype, time, icIDs, token, result = null) {
    let newActions = [];
    icIDs.forEach(id => {
      let newAction = {}
      newAction['action'] = actiontype
      newAction['when'] = time

      // the following is not required by the protocol; it is an internal help
      newAction["icid"] = id

      newActions.push(newAction);
    })

    console.log("Dispatching actions for configs", newActions)
    AppDispatcher.dispatch({
      type: 'ics/start-action',
      action: newActions,
      result: result,
      token: token
    });
  }

  stop(icIDs, time, token) {
    this.dispatchActionsForMultipleICs('stop', time, icIDs, token)
  }

  pause(icIDs, time, token) {
    this.dispatchActionsForMultipleICs('pause', time, icIDs, token)
  }

  resume(icIDs, time, token) {
    this.dispatchActionsForMultipleICs('resume', time, icIDs, token)
  }
}

export default new ICAction();
