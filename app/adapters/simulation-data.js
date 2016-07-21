/**
 * File: simulation-data.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.Adapter.extend({
  host: 'ws://' + ENV.APP.LIVE_HOST,
  namespace: '',

  socket: null,

  findRecord(store, type, id, snapshot) {
    this._init();

    return new Ember.RSVP.Promise(function(resolve, reject) {
      //reject(new Error('no record'));
      reject();
    });
  },

  _init() {
    if (this.socket === null) {
      // create new websocket
      this.socket = new WebSocket(this.host + this.namespace);
      this.socket.binaryType = 'arraybuffer';

      // register event callbacks
      var self = this;
      this.socket.onopen = function(event) {
        self.open.apply(self, [event]);
      };

      this.socket.onmessage = function(event) {
        self.message.apply(self, [event]);
      };

      this.socket.onerror = function(event) {
        self.error.apply(self, [event]);
      };

      this.socket.onclose = function(event) {
        self.close.apply(self, [event]);
      };
    }
  },

  open(event) {
    Ember.debug('websocket opened');
  },

  close(event) {
    Ember.debug('websocket closed: ' + event.code);
  },

  message(event) {
    // read the message into JSON
    var message = this._messageToJSON(event.data);
    var id = 0;

    var simulationData = this.store.peekRecord('simulation-data', id);
    if (simulationData != null) {
      simulationData.set('sequence', message.sequence);
      simulationData.set('values', message.values);
    } else {
      this.store.createRecord('simulation-data', {
        sequence: message.sequence,
        values: message.values,
        id: id
      });
    }
  },

  error(err) {
    Ember.debug('websocket error');
  },

  _messageToJSON(blob) {
    var data = new DataView(blob);

    let OFFSET_ENDIAN = 1;
    let OFFSET_TYPE = 2;
    let OFFSET_VERSION = 4;

    var bits = data.getUint8(0);
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
      values: values
    };
  }
});
