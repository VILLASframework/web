/**
 * File: files-data-manager.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 16.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import RestDataManager from './rest-data-manager';
import RestAPI from '../api/rest-api';
import AppDispatcher from '../app-dispatcher';

class FilesDataManager extends RestDataManager {
  constructor() {
    super('file', '/files');
  }

  upload(file) {
    RestAPI.upload(this.makeURL('/upload'), file).then(response => {
      AppDispatcher.dispatch({
        type: 'files/uploaded'
      });

      console.log(response);
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'files/upload-error',
        error: error
      });
    });
  }
}

export default new FilesDataManager();
