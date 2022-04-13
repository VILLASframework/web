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
import AppDispatcher from '../app-dispatcher';

class WebRTC {
  constructor(sessionurl, identifier) {
    this.identifier = identifier
    this.first = false;
    this.polite = false;
    this.ignoreOffer = false;
    this.makingOffer = false;

    this.peerConnection = null;
    this.dataChannel = null;
    this.signalingClient = null;

    this.iceUsername = 'villas';
    this.icePassword = 'villas';
    this.iceUrls = [
      'stun:stun.0l.de:3478',
      'turn:turn.0l.de:3478?transport=udp',
      'turn:turn.0l.de:3478?transport=tcp'
    ];

    this.connectPeers(sessionurl)
  }

  // Connect the two peers. Normally you look for and connect to a remote
  // machine here, but we're just connecting two local objects, so we can
  // bypass that step.
  connectPeers(sessionurl) {
    // Create the local connection and its event listeners
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{
        username: this.iceUsername,
        credential: this.icePassword,
        urls: this.iceUrls
      }]
    });

    this.peerConnection.onicecandidate = this.handleIceCandidate.bind(this);
    this.peerConnection.onnegotiationneeded = this.handleNegotationNeeded.bind(this);
    this.peerConnection.ondatachannel = this.handleNewDataChannel.bind(this)

    this.peerConnection.onconnectionstatechange = () => console.info('Connection state changed:', this.peerConnection.connectionState);
    this.peerConnection.onsignalingstatechange = () => console.info('Signaling state changed:', this.peerConnection.signalingState);
    this.peerConnection.oniceconnectionstatechange = () => console.info('ICE connection state changed:', this.peerConnection.iceConnectionState);
    this.peerConnection.onicegatheringstatechange = () => console.info('ICE gathering state changed:', this.peerConnection.iceGatheringState);

    this.hallo()

    this.signalingClient = new WebSocket(sessionurl);
    this.signalingClient.onmessage = this.handleSignalingMessage.bind(this);

    // Some more logging
    this.signalingClient.onopen = (e) => console.info('Connected to signaling channel', e);
    this.signalingClient.onerror = (e) => console.error('Failed to establish signaling connection', e);
  }

  hallo() {
    console.info("peer connection (hallo):")
    console.info(this.peerConnection)
  }

  handleIceCandidate(event) {
    if (event.candidate == null) {
      console.info('Candidate gathering completed');
      return;
    }

    console.info('New local ICE Candidate', event.candidate);

    let msg = {
      candidate: event.candidate.toJSON()
    };
    console.info('Sending signaling message', msg);
    this.signalingClient.send(JSON.stringify(msg));
  }

  async handleNegotationNeeded() {
    console.info('Negotation needed!');

    try {
      this.makingOffer = true;
      await this.peerConnection.setLocalDescription();
      let msg = {
        description: this.peerConnection.localDescription.toJSON()
      };
      console.info('Sending signaling message', msg);
      this.signalingClient.send(JSON.stringify(msg));
    } catch (err) {
      console.error(err);
    } finally {
      this.makingOffer = false;
    }
  }

  handleNewDataChannel(e) {
    console.info('New datachannel', e.channel)

    //this.handleDataChannel(e.channel);
    this.handleDataChannel(e.channel).bind(this);
  }

  handleDataChannel(ch) {
    this.dataChannel = ch;

    this.dataChannel.onopen = () => console.info('Datachannel opened');
    this.dataChannel.onclose = () => console.info('Datachannel closed');
    this.dataChannel.onmessage = this.handleDataChannelMessage.bind(this);
  }

  async handleSignalingMessage(event) {
    let msg = JSON.parse(event.data);

    console.info('Received signaling message', msg);

    try {
      if (msg.control !== undefined) {
        this.first = true;
        for (var connection of msg.control.connections) {
          if (connection.id < msg.control.connection_id)
            this.first = false;
        }

        this.polite = this.first;

        console.info('Role', {
          polite: this.polite,
          first: this.first
        })

        if (!this.first) {
          // Create the data channel and establish its event listeners
          let ch = this.peerConnection.createDataChannel('villas');

          this.handleDataChannel(ch);
        }
      } else if (msg.description !== undefined) {
        const offerCollision = (msg.description.type == 'offer') &&
          (this.makingOffer || this.peerConnection.signalingState != 'stable');

        this.ignoreOffer = !this.polite && offerCollision;
        if (this.ignoreOffer) {
          return;
        }

        await this.peerConnection.setRemoteDescription(msg.description);
        console.info(msg.description);
        if (msg.description.type == 'offer') {
          await this.peerConnection.setLocalDescription();
          let msg = {
            description: this.peerConnection.localDescription.toJSON()
          }
          this.signalingClient.send(JSON.stringify(msg))
        }
      } else if (msg.candidate !== undefined) {
        try {
          console.info('New remote ICE candidate', msg.candidate);
          await this.peerConnection.addIceCandidate(msg.candidate);
        } catch (err) {
          if (!this.ignoreOffer) {
            throw err;
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  handleDataChannel(channel) {
    this.dataChannel = channel;
    this.dataChannel.onopen = () => console.info('Datachannel opened');
    this.dataChannel.onclose = () => console.info('Datachannel closed');
    this.dataChannel.onmessage = this.handleDataChannelMessage;
  }

  async jsonToMessageArray(msgJson) {
    // parse incoming message into usable data
    if (msgJson.length === 0) {
      return null;
    }

    const ts = msgJson.ts.origin[0] * 1e3 + msgJson.ts.origin[1] * 1e-6

    return {
      version: 2,
      type: 0,
      source_index: 0,
      length: length,
      sequence: msgJson.sequence,
      timestamp: ts,
      values: msgJson.data,
      blob: new DataView(msgJson.data),
      // id: id
    };
  }
    
  // Handle onmessage events for the receiving channel.
  // These are the data messages sent by the sending channel.
  async handleDataChannelMessage(event) {
    var dec = new TextDecoder();

    var raw = event.data;
    var msg = dec.decode(await raw.arrayBuffer());
    var msgJson = JSON.parse(msg);

    console.info('Received message', msgJson);
    let msgarr = null

    
    const ts = msgJson[0].ts.origin[0] * 1e3 + msgJson[0].ts.origin[1] * 1e-6
    let buffer = new Float64Array(msgJson[0].data).buffer

    msgarr = {
      version: 2,
      type: 0,
      source_index: 0,
      length: 5,
      sequence: msgJson[0].sequence,
      timestamp: ts,
      values: msgJson[0].data,
      blob: new DataView(buffer)
    };

    if (msgarr) {
      AppDispatcher.dispatch({
        type: 'icData/data-changed',
        data: [msgarr],
        id: 547648
      });
    }
  }

  disconnectPeers() {
    console.log("disconnecting peers")

    if (this.signalingClient)
      this.signalingClient.close()

    if (this.dataChannel)
      this.dataChannel.close();

    if (this.peerConnection)
      this.peerConnection.close();

    this.dataChannel = null;
    this.peerConnection = null;
    this.signalingClient = null;
  }

}

export default WebRTC;
