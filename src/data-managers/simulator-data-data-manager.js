/**
 * File: simulator-data-data-manager.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2017
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

import WebsocketAPI from '../api/websocket-api';
import AppDispatcher from '../app-dispatcher';

class SimulatorDataDataManager {
  constructor() {
    this._sockets = {};
  }

  open(endpoint, identifier, signals) {
    // pass signals to onOpen callback
    if (this._sockets[identifier] != null) {
      if (this._sockets[identifier].url !== WebsocketAPI.getURL(endpoint)) {
        // replace connection, since endpoint changed
        this._sockets.close();

        this._sockets[identifier] = WebsocketAPI.addSocket(endpoint, { onOpen: (event) => this.onOpen(event, identifier, signals), onClose: (event) => this.onClose(event, identifier), onMessage: (event) => this.onMessage(event, identifier) });
      }
    } else {
      // set flag if a socket to this simulator was already create before
      if (this._sockets[identifier] === null) {
        this._sockets[identifier] = WebsocketAPI.addSocket(endpoint, { onOpen: (event) => this.onOpen(event, identifier, signals, false), onClose: (event) => this.onClose(event, identifier), onMessage: (event) => this.onMessage(event, identifier) });
      } else {
        this._sockets[identifier] = WebsocketAPI.addSocket(endpoint, { onOpen: (event) => this.onOpen(event, identifier, signals, true), onClose: (event) => this.onClose(event, identifier), onMessage: (event) => this.onMessage(event, identifier) });
      }
    }
  }

  closeAll() {
    // close every open socket
    for (var key in this._sockets) {
      if (this._sockets.hasOwnProperty(key)) {
        this._sockets[key].close(4000);
        delete this._sockets[key];
      }
    }
  }

  onOpen(event, identifier, signals, firstOpen) {
    AppDispatcher.dispatch({
      type: 'simulatorData/opened',
      identifier: identifier,
      signals: signals,
      firstOpen: firstOpen
    });
  }

  onClose(event, identifier) {
    AppDispatcher.dispatch({
      type: 'simulatorData/closed',
      identifier: identifier,
      notification: (event.code !== 4000)
    });

    // remove from list, keep null reference for flag detection
    delete this._sockets[identifier];
  }

  onMessage(event, identifier) {
    var message = this.bufferToMessage(event.data);

    AppDispatcher.dispatch({
      type: 'simulatorData/data-changed',
      data: message,
      identifier: identifier
    });
  }

  bufferToMessage(blob) {
    // parse incoming message into usable data
    var data = new DataView(blob);

    let OFFSET_TYPE = 2;
    let OFFSET_VERSION = 4;

    var bits = data.getUint8(0);
    var length = data.getUint16(0x02, 1);

    var values = new Float32Array(data.buffer, data.byteOffset + 0x10, length);

    return {
      version: (bits >> OFFSET_VERSION) & 0xF,
      type: (bits >> OFFSET_TYPE) & 0x3,
      length: length,
      sequence: data.getUint32(0x04, 1),
      timestamp: data.getUint32(0x08, 1) * 1e3 + data.getUint32(0x0C, 1) * 1e-6,
      values: values
    };
  }
}

export default new SimulatorDataDataManager();
