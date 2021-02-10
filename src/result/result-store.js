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
import ResultsDataManager from './results-data-manager';
import FilesDataManager from '../file/files-data-manager'

class ResultStore extends ArrayStore {
  constructor() {
    super('results', ResultsDataManager);
  }

  simplify(timestamp) {
    let parts = timestamp.split("T");
    let datestr = parts[0];
    let time = parts[1].split(".");

    return datestr + ', ' + time[0];;
  }

  simplifyTimestamps(data) {
    data.forEach((result) => {
      result.createdAt = this.simplify(result.createdAt);
      result.updatedAt = this.simplify(result.updatedAt);
    });
  }

  reduce(state, action) {
    switch (action.type) {
      case 'results/loaded':
        if (Array.isArray(action.data)) {
          this.simplifyTimestamps(action.data);
        } else {
          this.simplifyTimestamps([action.data]);
        }
        return super.reduce(state, action);

      case 'results/added':
        this.simplifyTimestamps([action.data]);
        return super.reduce(state, action);

      case 'resultfiles/start-upload':
        ResultsDataManager.uploadFile(action.data, action.resultID, action.token, action.progressCallback, action.finishedCallback, action.scenarioID);
        return state;

      case 'resultfiles/start-remove':
        ResultsDataManager.removeFile(action.resultID, action.fileID, action.scenarioID, action.token);
        return state;

      default:
        return super.reduce(state, action);
    }
  }

}

export default new ResultStore();