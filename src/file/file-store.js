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
import FilesDataManager from './files-data-manager';

class FileStore extends ArrayStore {
  constructor() {
    super('files', FilesDataManager);
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

  reduce(state, action) {
    switch (action.type) {
      case 'files/start-download':
        FilesDataManager.download(action)
        return state

      case 'files/start-upload':
        FilesDataManager.upload(action.data, action.token, action.progressCallback, action.finishedCallback, action.scenarioID);
        return state;

      case 'files/uploaded':
        //console.log('ready uploaded');
        return state;

      case 'files/upload-error':
        console.log(action.error);
        return state;

      case 'files/downloaded':
        // in this case a file is contained in the response (no JSON)
        return this.saveFile(state, action);

      case 'files/start-edit':
          FilesDataManager.update(action.data, action.token, action.id);
        return state;

      case 'files/edited':
          return this.updateElements(state, [action.data]);

      case this.type + '/edit-error':
        return state;

      default:
        return super.reduce(state, action);
    }
  }
}

export default new FileStore();
