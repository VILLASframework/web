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
import SignalsDataManager from './signals-data-manager'
import NotificationsDataManager from "../common/data-managers/notifications-data-manager";

class SignalStore extends  ArrayStore{
  constructor() {
    super('signals', SignalsDataManager);
  }

  reduce(state, action) {
    switch (action.type) {
      case 'signals/added':
        this.dataManager.reloadConfig(action.token, action.data);
        return super.reduce(state, action);
      case 'signals/removed':
        this.dataManager.reloadConfig(action.token, action.data);
        return super.reduce(state, action);

      case 'signals/start-autoconfig':
        this.dataManager.startAutoConfig(action.data, action.url, action.socketname, action.token, action.configID)
        return super.reduce(state, action);

      case 'signals/autoconfig-loaded':
        console.log("AutoConfig Loaded: ", action.data)
        // TODO save signal config contained in action.data
        this.dataManager.saveSignals(action.data, action.token, action.configID, action.socketname);

        return super.reduce(state, action);

      case 'signals/autoconfig-error':
        if (action.error && !action.error.handled && action.error.response) {

          const SIGNAL_AUTOCONF_ERROR_NOTIFICATION = {
            title: 'Failed to load signal config ',
            message: action.error.response.body.message,
            level: 'error'
          };
          NotificationsDataManager.addNotification(SIGNAL_AUTOCONF_ERROR_NOTIFICATION);

        }
        return super.reduce(state, action);

      default:
        return super.reduce(state, action);
    }
  }


}

export default new SignalStore();
