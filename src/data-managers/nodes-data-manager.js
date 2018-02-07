/**
 * File: nodes-data-manager.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2017
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

import RestDataManager from './rest-data-manager';
import RestAPI from '../api/rest-api';
import AppDispatcher from '../app-dispatcher';

class NodesDataManager extends RestDataManager {
  constructor() {
    super('node', '/nodes');
  }

  getURL(node) {
    //  create an anchor element (note: no need to append this element to the document)
    var link = document.createElement('a');
    link.href = node.endpoint;
    link.pathname = link.pathname + 'api/v1';

    return link.href;
  }

  getSimulators(node) {
    RestAPI.post(this.getURL(node), {
      action: 'nodes',
      id: node._id
    }).then(response => {
      // assign IDs to simulators
      response.response.forEach(element => {
        if (element.type === "websocket") {
          // add the (villas-node) node ID to the simulator
          node.simulators = node.simulators.map(simulator => {
            if (simulator.name === element.name) {
              simulator.id = element.id;
            }

            return simulator;
          });
        }
      });

      AppDispatcher.dispatch({
        type: 'nodes/simulatorsFetched',
        data: node
      });

      AppDispatcher.dispatch({
        type: 'simulatorData/open',
        node: node,
        endpoint: node.endpoint,
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'nodes/simulatorsFetch-error',
        error: error
      });
    });
  }

  update(object, token = null) {
    var obj = {};
    obj[this.type] = this.filterKeys(object);

    // filter simulator IDs
    obj[this.type].simulators = obj[this.type].simulators.map(simulator => {
      delete simulator.id;
      return simulator;
    });

    RestAPI.put(this.makeURL(this.url + '/' + object._id), obj, token).then(response => {
      AppDispatcher.dispatch({
        type: this.type + 's/edited',
        data: Object.assign({}, object, response[this.type])
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: this.type + 's/edit-error',
        error: error
      });
    });
  }
}

export default new NodesDataManager();
