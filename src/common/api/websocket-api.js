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
import NotificationsDataManager from "../data-managers/notifications-data-manager";
import AppDispatcher from '../app-dispatcher';

class WebsocketAPI {
  constructor(websocketurl, callbacks) {
    this.websocketurl = websocketurl;
    this.callbacks = callbacks;

    this.wasConnected = false;
    this.isClosing = false;

    this.connect(websocketurl, callbacks);
  }

  connect(websocketurl, callbacks) {
    // create web socket client
    this.socket = new WebSocket(WebsocketAPI.getURL(websocketurl), 'live');
    this.socket.binaryType = 'arraybuffer';
    this.socket.onclose = this.onClose;
    this.socket.onopen = this.onOpen;
    this.socket.onerror = this.onError;

    // register callbacks
    if (callbacks.onMessage)
        this.socket.onmessage = callbacks.onMessage;
  }

  reconnect() {
    //console.log("Reconnecting: " + this.websocketurl);
    this.connect(this.websocketurl, this.callbacks);
  }

  get url() {
    return WebsocketAPI.getURL(this.websocketurl);
  }

  send(data) {
    this.socket.send(data);
  }

  close(code, reason) {
    this.isClosing = true;
    this.socket.close(code, reason);
  }

  onError = e => {
    console.error('Error on WebSocket connection to: ' + this.websocketurl + ':', e);

    if ('onError' in this.callbacks)
      this.callbacks.onError(e);
  }

  onOpen = e => {
    AppDispatcher.dispatch({
      type: 'websocket/connected',
      data: this.websocketurl,
    });    
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
        AppDispatcher.dispatch({
          type: 'websocket/connection-error',
          data: this.websocketurl,
        });
        const IC_WEBSOCKET_CONNECTION_ERROR = {
          title: 'Websocket connection warning',
          message: "Connection to " + this.websocketurl + " dropped. Attempt reconnect in 1 sec",
          level: 'warning'
        };
        NotificationsDataManager.addNotification(IC_WEBSOCKET_CONNECTION_ERROR);
        console.log("Connection to " + this.websocketurl + " dropped. Attempt reconnect in 1 sec");
        window.setTimeout(() => { this.reconnect(); }, 1000);
      }
    }
  }

  static getURL(websocketurl) {
    // create an anchor element (note: no need to append this element to the document)
    var link = document.createElement('a');
    link.href = websocketurl;

    if (link.protocol === 'https:')
      link.protocol = 'wss:';
    else
      link.protocol = 'ws:';

    return link.href;
  }
}

export default WebsocketAPI;
