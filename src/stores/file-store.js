/**
 * File: file-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 16.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

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
