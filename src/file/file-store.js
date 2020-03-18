/**
 * File: file-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 16.03.2017
 *
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

    // save file data file
    let fileID = parseInt(action.data.id)
    console.log("Received file", action);
    for (let f of state){
      if (f.id === fileID){
        f["data"] = action.data.data;
        f.type = action.data.type;
        console.log("Saving file data to file id", fileID);
      }
    }

  }

  reduce(state, action) {
    switch (action.type) {
      case 'files/start-upload':
        FilesDataManager.upload(action.data, action.token, action.progressCallback, action.finishedCallback, action.objectType, action.objectID);
        return state;

      case 'files/uploaded':
        //console.log('ready uploaded');
        return state;

      case 'files/upload-error':
        console.log(action.error);
        return state;
      case 'files/loaded':
        if (Array.isArray(action.data)) {
          return super.reduce(state, action)
        } else {
          // in this case a file is contained in the response (no JSON)
          // TODO we have to extract and process the file here (=save it somewhere?)
          this.saveFile(state, action)
          return super.reduce(state, action)
        }

      default:
        return super.reduce(state, action);
    }
  }
}

export default new FileStore();
