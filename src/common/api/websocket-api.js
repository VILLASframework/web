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

class WebsocketAPI {
  constructor(host, callbacks) {
    this.host = host;
    this.callbacks = callbacks;

    this.wasConnected = false;
    this.isClosing = false;

    this.connect(host, callbacks);
  }

  connect(host, callbacks) {
    // create web socket client
    this.socket = new WebSocket(WebsocketAPI.getURL(host), 'live');
    this.socket.binaryType = 'arraybuffer';
    this.socket.onclose = this.onClose;
    this.socket.onopen = this.onOpen;
    this.socket.onerror = this.onError;

    // register callbacks
    if (callbacks.onMessage)
        this.socket.onmessage = callbacks.onMessage;
  }

  reconnect() {
    //console.log("Reconnecting: " + this.host);
    this.connect(this.host, this.callbacks);
  }

  get url() {
    return WebsocketAPI.getURL(this.host);
  }

  send(data) {
    this.socket.send(data);
  }

  close(code, reason) {
    this.isClosing = true;
    this.socket.close(code, reason);
  }

  onError = e => {
    console.error('Error on WebSocket connection to: ' + this.host + ':', e);

    if ('onError' in this.callbacks)
      this.callbacks.onError(e);
  }

  onOpen = e => {
    this.wasConnected = true;

    if ('onOpen' in this.callbacks)
        this.callbacks.onOpen(e);
  }

  onClose = e => {
    if (this.isClosing) {
      if ('onClose' in this.callbacks)
        this.callbacks.onClose(e);
    }
    else {
      if (this.wasConnected) {
        console.log("Connection to " + this.host + " dropped. Attempt reconnect in 1 sec");
        window.setTimeout(() => { this.reconnect(); }, 1000);
      }
    }
  }

  static getURL(host) {
    // create an anchor element (note: no need to append this element to the document)
    var link = document.createElement('a');
    link.href = host;

    if (link.protocol === 'https:')
      link.protocol = 'wss:';
    else
      link.protocol = 'ws:';

    return link.href;
  }
}

export default WebsocketAPI;
