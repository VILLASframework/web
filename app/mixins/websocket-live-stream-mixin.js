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
  runningSimulations: service('running-simulations'),
  store: service(),

  sockets: [],

  init() {
    this._super(...arguments);

    // load simulators
    var self = this;

    this.store.findAll('simulator').then(function() {
      // start simulators service
      self.get('runningSimulations').loadRunningSimulations();
    });
  },

  _runningSimulationsChanged: function() {
    // called each time running simulations did change
    var self = this;

    this.get('runningSimulations.simulationModels').forEach(function(simulationModel) {
      //console.log('Model: ' + simulationModel.get('name') + ' (' + simulationModel.get('simulator.name') + ')');

      // get socket for simulation model
      let modelid = simulationModel.get('id');
      var socket = self._socketForSimulationModel(modelid);

      // create new socket for simulation model if not running yet
      if (socket == null) {
        // try to create new socket
        socket = new WebSocket('ws://' + simulationModel.get('simulator.endpoint'));
        console.log('opened ' + simulationModel.get('simulator.endpoint'));

        if (socket != null) {
          socket.binaryType = 'arraybuffer';

          // register callbacks
          socket.onopen = function(event) { self.onopen.apply(self, [event]); };
          socket.onclose = function(event) { self.onclose.apply(self, [event]); };
          socket.onmessage = function(event) { self.onmessage.apply(self, [event]); };
          socket.onerror = function(event) { self.onerror.apply(self, [event]); };

          // save socket
          self._addSocketForSimulationModel(socket, modelid);

          console.log('simulation model \'' + simulationModel.get('name') + '\' started');
        }
      }
    });
  }.observes('runningSimulations.simulationModels.@each.mod'),

  _socketForSimulationModel(modelid) {
    this.get('sockets').forEach(function(s) {
      if (s.id === modelid) {
        return s.socket;
      }
    });

    return null;
  },

  _addSocketForSimulationModel(socket, modelid) {
    // search for existing socket to replace
    this.get('sockets').forEach(function(s) {
      if (s.id === modelid) {
        s.socket = socket;
        return;
      }
    });

    // add new socket
    this.get('sockets').pushObject({ id: modelid, socket: socket });
  },

  _removeSocketForSimulationModel(modelid) {
    var sockets = this.get('sockets');
    var i = 0;

    while (i < sockets.get('length')) {
      if (sockets[i].id === modelid) {
        // remove object from array
        sockets.slice(i, 1);
      } else {
        // only increase index if no object was removed
        i++;
      }
    }
  },

  onopen(/*event*/) {
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

  onerror(/*event*/) {
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
