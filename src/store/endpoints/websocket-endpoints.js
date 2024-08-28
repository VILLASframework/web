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


function setupWebSocket(WS_URL, onMessage, protocol) {
  const socket = new WebSocket(WS_URL, protocol); // Include the protocol here
  socket.binaryType = 'arraybuffer'; // Set binary type
  socket.onmessage = (event) => {
    onMessage(event.data);
  };
  return socket;
}

const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
};

export const websocketEndpoints = (builder) => ({
  getIcData: builder.query({
    query: () => ({data: []}),
    async onCacheEntryAdded(
      arg,
      { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
    ) {
      // create a websocket connection when the cache subscription starts
      const socket = new WebSocket('wss://villas.k8s.eonerc.rwth-aachen.de/ws/ws_sig', 'live');
      socket.binaryType = 'arraybuffer';
      try {
        // wait for the initial query to resolve before proceeding
        await cacheDataLoaded;

        // when data is received from the socket connection to the server,
        // if it is a message and for the appropriate channel,
        // update our query result with the received message
        const listener = (event) => {
          console.log(event.data)
        }

        socket.addEventListener('message', listener)
      } catch {
        // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
        // in which case `cacheDataLoaded` will throw
      }
      // cacheEntryRemoved will resolve when the cache subscription is no longer active
      await cacheEntryRemoved
      // perform cleanup steps once the `cacheEntryRemoved` promise resolves
      ws.close()
    },
  }),
});

function bufferToMessageArray(blob) {
  let offset = 0;
  const msgs = [];

  while (offset < blob.byteLength) {
    const msg = bufferToMessage(new DataView(blob, offset));
    if (msg !== undefined) {
      msgs.push(msg);
      offset += msg.blob.byteLength;
    }
  }

  return msgs;
}

function bufferToMessage(data) {
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
  };
}