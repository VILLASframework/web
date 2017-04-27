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

import ArrayStore from './array-store';
import FilesDataManager from '../data-managers/files-data-manager';

class FileStore extends ArrayStore {
  constructor() {
    super('files', FilesDataManager);
  }

  reduce(state, action) {
    switch (action.type) {
      case 'files/start-upload':
        FilesDataManager.upload(action.data);
        return state;

      case 'files/uploaded':
        console.log('ready uploaded');
        return state;

      case 'files/upload-error':
        console.log(action.error);
        return state;

      default:
        return super.reduce(state, action);
    }
  }
}

export default new FileStore();
