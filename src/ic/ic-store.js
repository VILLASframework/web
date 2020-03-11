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

import _ from 'lodash';

import ArrayStore from '../common/array-store';
import ICsDataManager from './ics-data-manager';
import ICDataDataManager from './ic-data-data-manager';

class InfrastructureComponentStore extends ArrayStore {
  constructor() {
    super('ics', ICsDataManager);
  }

  reduce(state, action) {
    switch(action.type) {
      case 'ics/loaded':
        // connect to each infrastructure component
        for (let ic of action.data) {
          const endpoint = _.get(ic, 'properties.endpoint') || _.get(ic, 'rawProperties.endpoint');
          if (endpoint != null && endpoint !== '') {
            ICDataDataManager.open(endpoint, ic.id);
          } else {
            // console.warn('Endpoint not found for IC at ' + endpoint);
            // console.log(ic);
          }
        }

        return super.reduce(state, action);

      case 'ics/edited':
        // connect to each infrastructure component
        const ic = action.data;
        const endpoint = _.get(ic, 'properties.endpoint') || _.get(ic, 'rawProperties.endpoint');

        if (endpoint != null && endpoint !== '') {
          ICDataDataManager.update(endpoint, ic.id);
        }

        return super.reduce(state, action);

      case 'ics/fetched':
        return this.updateElements(state, [action.data]);

      case 'ics/fetch-error':
        return state;

      case 'ics/start-action':
        if (!Array.isArray(action.data))
          action.data = [ action.data ]

        ICsDataManager.doActions(action.ic, action.data, action.token);
        return state;

      case 'ics/action-error':
        console.log(action.error);
        return state;

      default:
        return super.reduce(state, action);
    }
  }
}

export default new InfrastructureComponentStore();
