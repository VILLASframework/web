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

import ArrayStore from '../common/array-store';

class WebsocketStore extends ArrayStore {

    updateSocketStatus(state, socket) {
        let checkInclusion = false;
        state.forEach((element) => {
            if (element.url === socket.url) {
                element.connected = socket.connected;
                checkInclusion = true;
            }
        })
        if (!checkInclusion) {
            state.push(socket);
        }
        this.__emitChange();

        return state;
    }

    reduce(state, action) {
        let tempSocket = {};
        switch (action.type) {

            case 'websocket/connected':
                tempSocket.url = action.data;
                tempSocket.connected = true;
                return this.updateSocketStatus(state, tempSocket);

            case 'websocket/connection-error':
                tempSocket.url = action.data;
                tempSocket.connected = false;
                return this.updateSocketStatus(state, tempSocket);


            default:
                return super.reduce(state, action);
        }
    }
}

export default new WebsocketStore();
