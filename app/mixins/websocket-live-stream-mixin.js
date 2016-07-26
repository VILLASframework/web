import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Mixin.create({
  host: 'ws://' + ENV.APP.LIVE_HOST,
  namespace: '',

  init() {
    this._super(...arguments);

    // create socket
    var socket = new WebSocket(this.host + this.namespace);
    socket.binaryType = 'arraybuffer';

    // register event callbacks
    var self = this;
    socket.onopen = function(event) { self.onopen.apply(self, [event]); };
    socket.onclose = function(event) { self.onclose.apply(self, [event]); };
    socket.onmessage = function(event) { self.onmessage.apply(self, [event]); };
    socket.onerror = function(event) { self.onerror.apply(self, [event]); };
  },

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
