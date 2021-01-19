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

import RestDataManager from '../common/data-managers/rest-data-manager';
import RestAPI from '../common/api/rest-api';
import AppDispatcher from '../common/app-dispatcher';

class ResultsDataManager extends RestDataManager{

  constructor() {
    super('result', '/results');
  }

  upload(file, resultID, token = null, progressCallback = null, finishedCallback = null, scenarioID) {
    RestAPI.upload(this.makeURL(this.url + '/' + resultID + '/file') , file, token, progressCallback, scenarioID).then(response => {

      AppDispatcher.dispatch({
        type: 'resultfiles/uploaded',
      });

      // Trigger a files reload
      AppDispatcher.dispatch({
        type: 'results/start-load',
        param: '?scenarioID=' + scenarioID,
        token: token
      });

      if (finishedCallback) {
        finishedCallback(response.result.id);
      }
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'resultfiles/upload-error',
        error
      });
    });
  }

  download(action){
    RestAPI.download(this.makeURL(this.url), action.token, action.data).then(response => {
      AppDispatcher.dispatch({
        type: 'resultfiles/downloaded',
        data: response,
        id: action.data,
        token: action.token
      });

    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'resultfiles/load-error',
        error: error
      });
    });
  }

  /* only update file ids
  update(file, token, id) {

    RestAPI.put(this.makeURL(this.url + '/' + id), file, token).then(response => {
        AppDispatcher.dispatch({
          type: 'resultfiles/edited',
          data: response[this.type]
        });
      }).catch(error => {
        AppDispatcher.dispatch({
          type: 'resultfiles/edit-error',
          error: error
        });
      });
    }
  }*/

}

export default new ResultsDataManager();