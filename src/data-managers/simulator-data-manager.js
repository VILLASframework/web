/**
 * File: simulator-data-manager.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import WebsocketAPI from '../api/websocket-api';
import AppDispatcher from '../app-dispatcher';

class SimulationDataManager {
  open(endpoint, identifier) {
    WebsocketAPI.addSocket(endpoint, identifier, { onOpen: event => this.onOpen(event), onClose: event => this.onClose(event), onMessage: event => this.onMessage(event) });
  }

  onOpen(event) {
    // TODO: Add identifiers to callbacks

    AppDispatcher.dispatch({
      type: 'simulatorData/opened',
      identifier: 'RTDS',
      signals: 8
    });
  }

  onClose(event) {
    AppDispatcher.dispatch({
      type: 'simulatorData/closed'
    });
  }

  onMessage(event) {
    var message = this.bufferToMessage(event.data);

    AppDispatcher.dispatch({
      type: 'simulatorData/data-changed',
      data: message,
      identifier: 'RTDS'
    });
  }

  bufferToMessage(blob) {
    // parse incoming message into usable data
    var data = new DataView(blob);

    let OFFSET_ENDIAN = 1;
    let OFFSET_TYPE = 2;
    let OFFSET_VERSION = 4;

    var bits = data.getUint8(0);
    var simulator = data.getUint8(0x01);
    var endian = (bits >> OFFSET_ENDIAN) & 0x1 ? 0 : 1;
    var length = data.getUint16(0x02, endian);

    var values = new Float32Array(data.buffer, data.byteOffset + 0x10, length);

    return {
      endian: endian,
      version: (bits >> OFFSET_VERSION) & 0xF,
      type: (bits >> OFFSET_TYPE) & 0x3,
      length: length,
      sequence: data.getUint32(0x04, endian),
      timestamp: data.getUint32(0x08, endian) * 1e3 + data.getUint32(0x0C, endian) * 1e-6,
      values: values,
      simulator: simulator
    };
  }
}

export default new SimulationDataManager();
