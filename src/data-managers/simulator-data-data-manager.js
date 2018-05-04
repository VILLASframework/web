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

const OFFSET_TYPE = 2;
const OFFSET_VERSION = 4;

class SimulatorDataDataManager {
  constructor() {
    this._sockets = {};
  }

  open(endpoint, identifier) {
    // pass signals to onOpen callback
    if (this._sockets[identifier] != null) {
      if (this._sockets[identifier].url !== WebsocketAPI.getURL(endpoint)) {
        // replace connection, since endpoint changed
        this._sockets.close();

        this._sockets[identifier] = WebsocketAPI.addSocket(endpoint, { onOpen: (event) => this.onOpen(event, identifier), onClose: (event) => this.onClose(event, identifier), onMessage: (event) => this.onMessage(event, identifier), onError: (error) => this.onError(error, identifier) });
      }
    } else {
      this._sockets[identifier] = WebsocketAPI.addSocket(endpoint, { onOpen: (event) => this.onOpen(event, identifier, false), onClose: (event) => this.onClose(event, identifier), onMessage: (event) => this.onMessage(event, identifier), onError: (error) => this.onError(error, identifier) });
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

  send(message, identifier) {
    const socket = this._sockets[identifier];
    if (socket == null) {
      return false;
    }

    const data = this.messageToBuffer(message);
    socket.send(data);

    console.log(data);

    return true;
  }

  onOpen(event, identifier, firstOpen) {
    AppDispatcher.dispatch({
      type: 'simulatorData/opened',
      id: identifier,
      firstOpen: firstOpen
    });
  }

  onClose(event, identifier) {
    AppDispatcher.dispatch({
      type: 'simulatorData/closed',
      id: identifier,
      notification: (event.code !== 4000)
    });

    // remove from list, keep null reference for flag detection
    delete this._sockets[identifier];
  }

  onError(error, identifier) {
    console.error('Error on ' + identifier + ':' + error);
  }

  onMessage(event, identifier) {
    var msgs = this.bufferToMessageArray(event.data);

    if (msgs.length > 0) {
      AppDispatcher.dispatch({
        type: 'simulatorData/data-changed',
        data: msgs,
        id: identifier
      });
    }
  }

  bufferToMessage(data) {
    // parse incoming message into usable data
    if (data.byteLength === 0) {
      return null;
    }

    const id = data.getUint8(1);
    const bits = data.getUint8(0);
    const length = data.getUint16(0x02, 1);
    const bytes = length * 4 + 16;

    return {
      version: (bits >> OFFSET_VERSION) & 0xF,
      type: (bits >> OFFSET_TYPE) & 0x3,
      length: length,
      sequence: data.getUint32(0x04, 1),
      timestamp: data.getUint32(0x08, 1) * 1e3 + data.getUint32(0x0C, 1) * 1e-6,
      values: new Float32Array(data.buffer, data.byteOffset + 0x10, length),
      blob: new DataView(data.buffer, data.byteOffset + 0x00, bytes),
      id: id
    };
  }

  bufferToMessageArray(blob) {
    /* some local variables for parsing */
    let offset = 0;
    const msgs = [];

    /* for every msg in vector */
    while (offset < blob.byteLength) {
      const msg = this.bufferToMessage(new DataView(blob, offset));

      if (msg !== undefined) {
        msgs.push(msg);
        offset += msg.blob.byteLength;
      }
    }

    return msgs;
  }

  messageToBuffer(message) {
    const buffer = new ArrayBuffer(16 + 4 * message.length);
    const view = new DataView(buffer);

    let bits = 0;
    bits |= (message.version & 0xF) << OFFSET_VERSION;
    bits |= (message.type & 0x3) << OFFSET_TYPE;

    const sec = Math.floor(message.timestamp / 1e3);
    const nsec = (message.timestamp - sec * 1e3) * 1e6;

    view.setUint8(0x00, bits, true);
    view.setUint8(0x01, message.id, true);
    view.setUint16(0x02, message.length, true);
    view.setUint32(0x04, message.sequence, true);
    view.setUint32(0x08, sec, true);
    view.setUint32(0x0C, nsec, true);

    const data = new Float32Array(buffer, 0x10, message.length);
    data.set(message.values);

    return buffer;
  }
}

export default new SimulatorDataDataManager();
