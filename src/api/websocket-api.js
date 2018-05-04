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
  addSocket(endpoint, callbacks) {
    // create web socket client
    const socket = new WebSocket(this.getURL(endpoint), 'live');
    socket.binaryType = 'arraybuffer';

    // register callbacks
    if (callbacks.onOpen) socket.onopen = callbacks.onOpen;
    if (callbacks.onClose) socket.onclose = callbacks.onClose;
    if (callbacks.onMessage) socket.onmessage = callbacks.onMessage;
    if (callbacks.onError) socket.onerror = callbacks.onError;

    return socket;
  }

  getURL(endpoint) {
    //  create an anchor element (note: no need to append this element to the document)
    var link = document.createElement('a');
    link.href = endpoint;

    if (link.protocol === 'https:')
      link.protocol = 'wss:';
    else
      link.protocol = 'ws:';

    return link.href;
  }
}

export default new WebsocketAPI();
