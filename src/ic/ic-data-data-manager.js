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

import WebsocketAPI from '../common/api/websocket-api';
import AppDispatcher from '../common/app-dispatcher';
import RestAPI from "../common/api/rest-api";

const OFFSET_TYPE = 2;
const OFFSET_VERSION = 4;

class IcDataDataManager {
  constructor() {
    this._sockets = {};
  }

  open(websocketurl, identifier) {
    // pass signals to onOpen callback
    if (this._sockets[identifier] != null)
      return; // already open?

    this._sockets[identifier] = new WebsocketAPI(websocketurl, { onOpen: (event) => this.onOpen(event, identifier, true), onClose: (event) => this.onClose(event, identifier), onMessage: (event) => this.onMessage(event, identifier) });
  }

  update(websocketurl, identifier) {
    if (this._sockets[identifier] != null) {
      if (this._sockets[identifier].websocketurl !== websocketurl) {
        this._sockets[identifier].close();
        this._sockets[identifier] = new WebsocketAPI(websocketurl, { onOpen: (event) => this.onOpen(event, identifier, false), onClose: (event) => this.onClose(event, identifier), onMessage: (event) => this.onMessage(event, identifier), onError: (error) => this.onError(error, identifier) });
      }
    }
  }

  getStatus(url,socketname,token,icid,ic){
    RestAPI.get(url, null).then(response => {
      let tempIC = ic;
      tempIC.state = response.state;
      AppDispatcher.dispatch({
        type: 'ic-status/status-received',
        data: response,
        token: token,
        socketname: socketname,
        icid: icid,
        ic: ic
      });
      if(!ic.managedexternally){  
        AppDispatcher.dispatch({
          type: 'ics/start-edit',
          data: tempIC,
          token: token,
        });
      }
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'ic-status/status-error',
        error: error
      })
    })
  }

  getGraph(url,socketname,token,icid){
    RestAPI.apiDownload(url, null).then(response => {
      AppDispatcher.dispatch({
        type: 'ic-graph/graph-received',
        data: response,
        token: token,
        socketname: socketname,
        icid: icid,
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'ic-graph/graph-error',
        error: error
      })
    })
  }

  restart(url,socketname,token){
    RestAPI.post(url, null).then(response => {
      AppDispatcher.dispatch({
        type: 'ic-status/restart-successful',
        data: response,
        token: token,
        socketname: socketname,
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'ic-status/restart-error',
        error: error
      })
    })
  }

  shutdown(url,socketname,token){
    RestAPI.post(url, null).then(response => {
      AppDispatcher.dispatch({
        type: 'ic-status/shutdown-successful',
        data: response,
        token: token,
        socketname: socketname,
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'ic-status/shutdown-error',
        error: error
      })
    })
  }



  closeAll() {
    // close every open socket
    for (var identifier in this._sockets) {
      if (this._sockets.hasOwnProperty(identifier)) {
        this._sockets[identifier].close(4000);
        delete this._sockets[identifier];
      }
    }
  }

  send(message, identifier) {
    const socket = this._sockets[identifier];
    if (socket == null) {
      return false;
    }
    console.log("Sending to IC", identifier, "message: ", message);
    const data = this.messageToBuffer(message);
    socket.send(data);

    return true;
  }

  onOpen(event, identifier, firstOpen) {
    AppDispatcher.dispatch({
      type: 'icData/opened',
      id: identifier,
      firstOpen: firstOpen
    });
  }

  onClose(event, identifier) {
    AppDispatcher.dispatch({
      type: 'icData/closed',
      id: identifier,
      notification: (event.code !== 4000)
    });

    // remove from list, keep null reference for flag detection
    delete this._sockets[identifier];
  }

  onMessage(event, identifier) {
    var msgs = this.bufferToMessageArray(event.data);

    if (msgs.length > 0) {
      AppDispatcher.dispatch({
        type: 'icData/data-changed',
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
    view.setUint16(0x02, message.length, true);
    view.setUint32(0x04, message.sequence, true);
    view.setUint32(0x08, sec, true);
    view.setUint32(0x0C, nsec, true);

    const data = new Float32Array(buffer, 0x10, message.length);
    data.set(message.values);

    return buffer;
  }
}

export default new IcDataDataManager();
