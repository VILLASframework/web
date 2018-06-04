/**
 * File: websocket-api.js
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

class WebsocketAPI {
  constructor(endpoint, callbacks) {
    this.endpoint = endpoint;
    this.callbacks = callbacks;

    this.isClosing = false;

    this.connect(endpoint, callbacks);
  }

  connect(endpoint, callbacks) {
    // create web socket client
    this.socket = new WebSocket(WebsocketAPI.getURL(endpoint), 'live');
    this.socket.binaryType = 'arraybuffer';
    this.socket.onclose = this.onClose;

    // register callbacks
    if (callbacks.onOpen)
        this.socket.onopen = callbacks.onOpen;
    if (callbacks.onMessage)
        this.socket.onmessage = callbacks.onMessage;
    if (callbacks.onError)
        this.socket.onerror = callbacks.onError;
  }

  reconnect() {
    //console.log("Reconnecting: " + this.endpoint);
    this.connect(this.endpoint, this.callbacks);
  }

  get url() {
    return WebsocketAPI.getURL(this.endpoint);
  }

  send(data) {
    this.socket.send(data);
  }

  close(code, reason) {
    this.isClosing = true;
    this.socket.close(code, reason);
  }

  onClose = e => {
    if (this.isClosing) {
      if (this.callbacks.onClose)
        this.callbacks.onClose(e);
    }
    else {
      //console.log("Connection to " + this.endpoint + " dropped. Attempt reconnect in 1 sec");
      window.setTimeout(() => { this.reconnect(); }, 500);
    }
  }

  static getURL(endpoint) {
    // create an anchor element (note: no need to append this element to the document)
    var link = document.createElement('a');
    link.href = endpoint;

    if (link.protocol === 'https:')
      link.protocol = 'wss:';
    else
      link.protocol = 'ws:';

    return link.href;
  }
}

export default WebsocketAPI;
