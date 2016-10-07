/**
 * File: live-data.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 06.10.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Mixin.create({
  store: service(),
  sessionUser: service('session-user'),

  INTERVAL: 5000,

  _sockets: [],

  init: function() {
    this._super();

    // fetch the simulations for the first time
    this._fetchRunningSimulations();

    // start the polling loop
    setInterval((function(self) {
      return function() {
        self._fetchRunningSimulations();
      }
    })(this), this.INTERVAL);
  },

  _fetchRunningSimulations: function() {
    // check if the user is logged in
    if (this.get('sessionUser.user') != null) {
      // load simulators
      var self = this;

      this.get('store').findAll('simulator').then(function() {
        // get all simulations to find all running ones
        self.get('store').findAll('simulation').then(function(simulations) {
          simulations.forEach(function(simulation) {
            // check if the simulation is running
            if (simulation.get('running')) {
              // get all models
              simulation.get('models').forEach(function(model) {
                self.get('store').findRecord('simulation-model', model.get('id')).then(function(m) {
                  self._addSocket(m);
                });
              });
            }
          });
        });
      });
    }
  },

  _addSocket(simulationModel) {
    // search for existing socket
    var length = this.get('_sockets').length;

    for (var i = 0; i < length; i++) {
      if (this.get('_sockets')[i].id === simulationModel.get('id')) {
        // dont do anything
        return;
      }
    }

    // add new socket
    var socket = new WebSocket('ws://' + simulationModel.get('simulator.endpoint'));
    socket.binaryType = 'arraybuffer';

    // register callbacks
    var self = this;

    socket.onopen = function(event) { self._onSocketOpen.apply(self, [event]); };
    socket.onclose = function(event) { self._onSocketClose.apply(self, [event]); };
    socket.onmessage = function(event) { self._onSocketMessage.apply(self, [event]); };
    socket.onerror = function(event) { self._onSocketError.apply(self, [event]); };

    this.get('_sockets').pushObject({ id: simulationModel.get('id'), socket: socket });

    console.log('Socket created for ' + simulationModel.get('name') + ': ws://' + simulationModel.get('simulator.endpoint'));
  },

  _removeSocket(socket) {
    var length = this.get('_sockets').length;
    var i = 0;

    while (i < length) {
      if (this.get('_sockets')[i].socket === socket) {
        // remove object from array
        this.get('_sockets').slice(i, 1);
        console.log('socket removed');
      } else {
        // increase index if no object was removed
        i++;
      }
    }
  },

  _onSocketOpen(/* event */) {
    Ember.debug('websocket opened');
  },

  _onSocketClose(event) {
    if (event.wasClean) {

    } else {
      Ember.debug('websocket closed: ' + event.code);
    }

    // remove socket from array
    this._removeSocket(event.target);
  },

  _onSocketMessage(event) {
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

  _onSocketError(/* event */) {
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
