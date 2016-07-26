/**
 * File: websocket-live-stream-mixin.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 21.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';
import ENV from '../config/environment';

const { service } = Ember.inject;

export default Ember.Mixin.create({
  host: 'ws://' + ENV.APP.LIVE_HOST,
  namespace: '',
  runningSimulation: service('running-simulation'),

  socket: null,

  init() {
    this._super(...arguments);

    // start simulation service
    this.get('runningSimulation').loadRunningSimulation();
  },

  _runningSimulationChanged: function() {
    // called each time running simulation did change
    var simulation = this.get('runningSimulation.simulation');
    if (simulation !== null) {
      if (this.socket === null) {
        // create new socket connection
        this.socket = new WebSocket(this.host + this.namespace);
        this.socket.binaryType = 'arraybuffer';

        // register callbacks
        var self = this;
        this.socket.onopen = function(event) { self.onopen.apply(self, [event]); };
        this.socket.onclose = function(event) { self.onclose.apply(self, [event]); };
        this.socket.onmessage = function(event) { self.onmessage.apply(self, [event]); };
        this.socket.onerror = function(event) { self.onerror.apply(self, [event]); };
      }
    } else {
      // stop stream if still opened
      if (this.socket !== null) {
        this.socket.close();
        this.socket = null;
      }
    }
  }.observes('runningSimulation.simulation'),

  onopen(event) {
    Ember.debug('websocket opened');
  },

  onclose(event) {
    Ember.debug('websocket closed: ' + event.code);
  },

  onmessage(event) {
    // read the message into JSON
    var message = this._messageToJSON(event.data);

    var simulationData = this.store.peekRecord('simulation-data', message.simulator);
    if (simulationData != null) {
      simulationData.set('sequence', message.sequence);
      simulationData.set('values', message.values);
    } else {
      this.store.createRecord('simulation-data', {
        sequence: message.sequence,
        values: message.values,
        id: message.simulator
      });
    }
  },

  onerror(event) {
    Ember.debug('websocket error');
  },

  _messageToJSON(blob) {
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
});
