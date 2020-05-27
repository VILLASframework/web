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
 ************************************************************s*****************/


import ScenariosDataManager from './scenarios-data-manager';
import ArrayStore from '../common/array-store';

//export default new ArrayStore('scenarios', ScenariosDataManager);

class ScenarioStore extends ArrayStore {
    constructor() {
      super('scenarios', ScenariosDataManager);
    }

    getInitialState() {
        return {
            state: super.getInitialState(),
            users: null
        };
    }

    getUsers(token, id) {
        ScenariosDataManager.getUsers(token, id);
    }

    reduce(state, action) {
        switch (action.type) {
            case 'scenarios/users':
                state.users = action.users;
                return state;
            case 'scenarios/users-error':
                return state;

            default:
                return super.reduce(state, action);
        }
    }

}

export default new ScenarioStore();