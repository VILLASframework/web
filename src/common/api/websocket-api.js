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

const OFFSET_TYPE = 2;
const OFFSET_VERSION = 4;

class WebSocketManager {
  constructor() {
    this.socket = null;
  }

  id = null;

  connect(url, onMessage, onOpen, onClose) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('Already connected to:', url);
      return;
    }

    if (this.socket) {
      this.socket.close();
    }

    this.socket = new WebSocket(url, 'live');
    this.socket.binaryType = 'arraybuffer';

    this.socket.onopen = onOpen;
    this.socket.onmessage = (event) => {
      const msgs = this.bufferToMessageArray(event.data);
      onMessage(msgs);
    };
    this.socket.onclose = onClose;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      console.log('WebSocket connection closed');
    }
  }

  bufferToMessageArray(blob) {
    /* some local variables for parsing */
    let offset = 0;
    const msgs = [];

    /* for every msg in vector */
    while (offset < blob.byteLength) {
      const msg = this.bufferToMessage(new DataView(blob, offset));

      if (msg !== undefined) {
        msgs.push(msg);
        offset += msg.blob.byteLength;
      }
    }

    return msgs;
}

  bufferToMessage(data) {
    // parse incoming message into usable data
    if (data.byteLength === 0) {
        return null;
      }
  
      const source_index = data.getUint8(1);
      const bits = data.getUint8(0);
      const length = data.getUint16(0x02, 1);
      const bytes = length * 4 + 16;
  
      return {
        version: (bits >> OFFSET_VERSION) & 0xF,
        type: (bits >> OFFSET_TYPE) & 0x3,
        source_index: source_index,
        length: length,
        sequence: data.getUint32(0x04, 1),
        timestamp: data.getUint32(0x08, 1) * 1e3 + data.getUint32(0x0C, 1) * 1e-6,
        values: new Float32Array(data.buffer, data.byteOffset + 0x10, length),
        blob: new DataView(data.buffer, data.byteOffset + 0x00, bytes),
        // id: id
      };
}
}

export const wsManager = new WebSocketManager();
