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

  saveFile(state, action){

    let fileID = parseInt(action.id)
    state.forEach((element, index, array) => {
         if (element.id === fileID) {
           // save blob object
           array[index]["data"] = new Blob([action.data.data], {type: action.data.type});
           // update file type
           array[index]["type"] = action.data.type;

           if (array[index]["objectURL"] !== ''){
             // free memory of previously generated object URL
             URL.revokeObjectURL(array[index]["objectURL"]);
           }
           // create an object URL for the file
           array[index]["objectURL"] = URL.createObjectURL(array[index]["data"])
        }
    });

    // announce change to listeners
    this.__emitChange();
    return state
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
        this.simplifyTimestamps(action.data);
        return super.reduce(state, action);

      case 'results/added':
        this.simplifyTimestamps([action.data]);
        return super.reduce(state, action);

      case 'resultfiles/start-download':
        //FilesDataManager.download(action)
        return state

      case 'resultfiles/start-upload':
        ResultsDataManager.uploadFile(action.data, action.resultID, action.token, action.progressCallback, action.finishedCallback, action.scenarioID);
        return state;

      case 'resultfiles/uploaded':
        return state;

      case 'resultfiles/upload-error':
        console.log(action.error);
        return state;

      case 'resultfiles/downloaded':
        // in this case a file is contained in the response (no JSON)
        return this.saveFile(state, action);

      case 'resultfiles/start-edit':
        ResultsDataManager.update(action.data, action.token, action.id);
        return state;

      case 'resultfiles/edited':
          return this.updateElements(state, [action.data]);

      case 'resultfiles/edit-error':
        return state;

      default:
        return super.reduce(state, action);
    }
  }

}

export default new ResultStore();