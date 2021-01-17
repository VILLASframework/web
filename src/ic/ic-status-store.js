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
import ICDataDataManager from './ic-data-data-manager';

class ICStatusStore extends ArrayStore {
  constructor() {
    super('ic-status', ICDataDataManager);
  }


  reduce(state, action) {
    switch(action.type) {

      case 'ic-status/get-status':
        ICDataDataManager.getStatus(action.url, action.socketname, action.token, action.icid, action.ic);
        return super.reduce(state, action);

      case 'ic-status/status-received':
        let tempData = action.data;
        tempData.icID = action.icid;

        // TODO: edit state (e.g. running) of IC according to received state (only for ICs that are NOT managed externally)
        // TODO: playback state info to backend using start-edit dispatch for IC

        return this.updateElements(state, [tempData]);

      case 'ic-status/status-error':
        console.log("status error");
        return state;

      case 'ic-status/restart':
        ICDataDataManager.restart(action.url, action.socketname, action.token);
        return state;

      case 'ic-status/restart-successful':
        return state;

      case 'ic-status/restart-error':
        console.log("restart error");
        return state;

      case 'ic-status/shutdown':
        ICDataDataManager.shutdown(action.url, action.socketname, action.token);
        return state;

      case 'ic-status/shutdown-successful':
        return state;

      case 'ic-status/shutdown-error':
        console.log("shutdown error");
        return state;

      default:
        return super.reduce(state, action);
    }
  }
}

export default new ICStatusStore();
