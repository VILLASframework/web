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
    this.sockets = []; // Array to store multiple socket objects
  }

  connect(id, url, onMessage, onOpen, onClose) {
    const existingSocket = this.sockets.find((s) => s.id === id);
    if (existingSocket && existingSocket.socket.readyState === WebSocket.OPEN) {
      console.log("Already connected to:", url);
      return;
    }

    const socket = new WebSocket(url, "live");
    socket.binaryType = "arraybuffer";

    socket.onopen = onOpen;
    socket.onmessage = (event) => {
      const msgs = this.bufferToMessageArray(event.data);
      onMessage(msgs, id);
    };
    socket.onclose = onClose;

    // Store the new socket along with its id
    this.sockets.push({ id, socket });
  }

  disconnect(id) {
    const socket = this.sockets.find((s) => s.id === id);
    if (socket) {
      socket.socket.close();
      this.sockets = this.sockets.filter((s) => s.id !== id);
      console.log("WebSocket connection closed for id:", id);
    }
  }

  send(id, message) {
    const socket = this.sockets.find((s) => s.id === id);
    if (socket == null) {
      return false;
    }
    const data = this.messageToBuffer(message);
    console.log("📤 Sending binary buffer to server:", message.values);
    socket.socket.send(data);

    return true;
  }

  messageToBuffer(message) {
    const buffer = new ArrayBuffer(16 + 4 * message.length);
    const view = new DataView(buffer);

    let bits = 0;
    bits |= (message.version & 0xf) << OFFSET_VERSION;
    bits |= (message.type & 0x3) << OFFSET_TYPE;

    let source_index = 0;
    source_index |= message.source_index & 0xff;

    const sec = Math.floor(message.timestamp / 1e3);
    const nsec = (message.timestamp - sec * 1e3) * 1e6;

    view.setUint8(0x00, bits, true);
    view.setUint8(0x01, source_index, true);
    view.setUint16(0x02, message.length, true);
    view.setUint32(0x04, message.sequence, true);
    view.setUint32(0x08, sec, true);
    view.setUint32(0x0c, nsec, true);

    const data = new Float32Array(buffer, 0x10, message.length);
    data.set(message.values);

    return buffer;
  }

  bufferToMessageArray(blob) {
    let offset = 0;
    const msgs = [];

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
    if (data.byteLength === 0) {
      return null;
    }

    const source_index = data.getUint8(1);
    const bits = data.getUint8(0);
    const length = data.getUint16(0x02, 1);
    const bytes = length * 4 + 16;

    return {
      version: (bits >> OFFSET_VERSION) & 0xf,
      type: (bits >> OFFSET_TYPE) & 0x3,
      source_index: source_index,
      length: length,
      sequence: data.getUint32(0x04, 1),
      timestamp: data.getUint32(0x08, 1) * 1e3 + data.getUint32(0x0c, 1) * 1e-6,
      values: new Float32Array(data.buffer, data.byteOffset + 0x10, length),
      blob: new DataView(data.buffer, data.byteOffset + 0x00, bytes),
    };
  }

  getSocketById(id) {
    const socketEntry = this.sockets.find((s) => s.id === id);
    return socketEntry ? socketEntry.socket : null;
  }

  isConnected(id) {
    const socket = this.getSocketById(id);
    return socket && socket.readyState === WebSocket.OPEN;
  }
}

export const wsManager = new WebSocketManager();
