/**
 * File: websocket-api.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

class WebsocketAPI {
  addSocket(endpoint, callbacks) {
    // create web socket client
    var socket = new WebSocket(this.getURL(endpoint), 'live');
    socket.binaryType = 'arraybuffer';

    // register callbacks
    if (callbacks.onOpen) socket.addEventListener('open', event => callbacks.onOpen(event));
    if (callbacks.onClose) socket.addEventListener('close', event => callbacks.onClose(event));
    if (callbacks.onMessage) socket.addEventListener('message', event => callbacks.onMessage(event));
    if (callbacks.onError) socket.addEventListener('error', event => callbacks.onError(event));

    return socket;
  }

  getURL(endpoint) {
    return 'ws://' + endpoint;
  }
}

export default new WebsocketAPI();
