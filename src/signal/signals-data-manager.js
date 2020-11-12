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

import RestDataManager from '../common/data-managers/rest-data-manager';
import RestAPI from "../common/api/rest-api";
import AppDispatcher from "../common/app-dispatcher";
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";

class SignalsDataManager extends RestDataManager{

  constructor() {
    super('signal', '/signals');
  }

  reloadConfig(token, data){
    // request in signals
    RestAPI.get(this.makeURL('/configs/' + data.configID), token).then(response => {
      AppDispatcher.dispatch({
        type: 'configs/edited',
        data: response.config
      });
    });

  }

  startAutoConfig(data, url, socketname, token, configID){
    // This function queries the VILLASnode API to obtain the configuration of the VILLASnode located at url
    // Endpoint: http[s]://server:port/api/v1 (to be generated based on IC host, port 4000)
    // data contains the request data: { action, id, (request)}
    // See documentation of VILLASnode API: https://villas.fein-aachen.org/doc/node-dev-api-node.html

    RestAPI.post(url, data).then(response => {
      AppDispatcher.dispatch({
        type: 'signals/autoconfig-loaded',
        data: response,
        token: token,
        socketname: socketname,
        configID: configID
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'signals/autoconfig-error',
        error: error
      })
    })
  }

  saveSignals(data, token, configID, socketname){
    // data.response contains the response from the VILLASnode API, an array of node configurations

    if(!data.hasOwnProperty("response")){
      const SIGNAL_AUTOCONF_ERROR_NOTIFICATION = {
        title: 'Failed to load signal config ',
        message: 'VILLASnode returned no response field.',
        level: 'error'
      };
      NotificationsDataManager.addNotification(SIGNAL_AUTOCONF_ERROR_NOTIFICATION);
      return;
    }

    let configured = false;
    let error = false;
    for(let nodeConfig of data.response){
      if(!nodeConfig.hasOwnProperty("name")){
        console.warn("Could not parse the following node config because it lacks a name parameter:", nodeConfig);
      } else if(nodeConfig.name === socketname){
        if(configured){
          const SIGNAL_AUTOCONF_WARNING_NOTIFICATION = {
            title: 'There might be a problem with the signal auto-config',
            message: 'VILLASnode returned multiple node configurations for the websocket ' + socketname + '. This is a problem of the VILLASnode.',
            level: 'warning'
          };
          NotificationsDataManager.addNotification(SIGNAL_AUTOCONF_WARNING_NOTIFICATION);
          continue;
        }
        // signals are not yet configured:
        console.log("Adding signals of websocket: ", nodeConfig);
        let index_in = 1
        let index_out = 1

        if(!nodeConfig.in.hasOwnProperty("signals")){
          const SIGNAL_AUTOCONF_ERROR_NOTIFICATION = {
            title: 'Failed to load in signal config ',
            message: 'No field for in signals contained in response.',
            level: 'error'
          };
          NotificationsDataManager.addNotification(SIGNAL_AUTOCONF_ERROR_NOTIFICATION);
          error = true;
        } else{

          // add all in signals
          for(let inSig of nodeConfig.in.signals) {
            console.log("adding input signal:", inSig);

            if (inSig.enabled) {
              let newSignal = {
                configID: configID,
                direction: 'in',
                name: inSig.hasOwnProperty("name") ? inSig.name : "in_" + String(index_in),
                unit: inSig.hasOwnProperty("unit") ? inSig.unit : '-',
                index: index_in,
                scalingFactor: 1.0
              };

              AppDispatcher.dispatch({
                type: 'signals/start-add',
                data: newSignal,
                token: token
              });

              index_in++;
            }
          }
        }

        if(!nodeConfig.out.hasOwnProperty("signals")){
          const SIGNAL_AUTOCONF_ERROR_NOTIFICATION = {
            title: 'Failed to load out signal config ',
            message: 'No field for out signals contained in response.',
            level: 'error'
          };
          NotificationsDataManager.addNotification(SIGNAL_AUTOCONF_ERROR_NOTIFICATION);
          error=true;
        }else {

          // add all out signals

          for (let outSig of nodeConfig.out.signals) {
            console.log("adding output signal:", outSig);

            if (outSig.enabled) {
              let newSignal = {
                configID: configID,
                direction: 'out',
                name: outSig.hasOwnProperty("name") ? outSig.name : "out_" + String(index_out),
                unit: outSig.hasOwnProperty("unit") ? outSig.unit : '-',
                index: index_out,
                scalingFactor: 1.0
              };

              AppDispatcher.dispatch({
                type: 'signals/start-add',
                data: newSignal,
                token: token
              });

              index_out++;
            }
          }
        }

        console.log("Configured", index_in-1, "input signals and", index_out-1, "output signals");
        configured=true;
      }

    }

    if(!error) {
      const SIGNAL_AUTOCONF_INFO_NOTIFICATION = {
        title: 'Signal configuration loaded successfully.',
        message: '',
        level: 'info'
      };
      NotificationsDataManager.addNotification(SIGNAL_AUTOCONF_INFO_NOTIFICATION);
    }

  }

}

export default new SignalsDataManager()
