/**
 * File: rest-api.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
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

import request from 'superagent/lib/client';
import Promise from 'es6-promise';
import NotificationsDataManager from '../data-managers/notifications-data-manager';


// TODO: Add this to a central pool of notifications
const SERVER_NOT_REACHABLE_NOTIFICATION = {
          title: 'Server not reachable',
          message: 'The server could not be reached. Please try again later.',
          level: 'error'
        };

const REQUEST_TIMEOUT_NOTIFICATION = {
          title: 'Request timeout',
          message: 'Request timed out. Please try again later.',
          level: 'error'
        };

// Check if the error was due to network failure, timeouts, etc.
// Can be used for the rest of requests
function isNetworkError(err) {
  let result = false;

  // If not status nor response fields, it is a network error. TODO: Handle timeouts
  if (err.status == null || err.response == null) {
    result = true;

    let notification = err.timeout? REQUEST_TIMEOUT_NOTIFICATION : SERVER_NOT_REACHABLE_NOTIFICATION;
    NotificationsDataManager.addNotification(notification);
  }
  return result;
}

class RestAPI {
  get(url, token) {
    return new Promise(function (resolve, reject) {
      var req = request.get(url);

      if (token != null) {
        req.set('Authorization', "Bearer " + token);

      }

      req.end(function (error, res) {
        if (res == null || res.status !== 200) {
          reject(error);
        } else {
          resolve(JSON.parse(res.text));
        }
      });
    });
  }

  post(url, body, token) {
    return new Promise(function (resolve, reject) {
      var req = request.post(url).send(body).timeout({ response: 5000 }); // Simple response start timeout (3s)

      if (token != null) {
        req.set('Authorization', "Bearer " + token);
      }

      req.end(function (error, res) {
        if (res == null || res.status !== 200) {

          error.handled = isNetworkError(error);

          reject(error);
        } else {
          resolve(JSON.parse(res.text));
        }
      });
    });
  }

  delete(url, token) {
    return new Promise(function (resolve, reject) {
      var req = request.delete(url);

      if (token != null) {
        req.set('Authorization', "Bearer " + token);
      }

      req.end(function (error, res) {
        if (res == null || res.status !== 200) {
          reject(error);
        } else {
          resolve(JSON.parse(res.text));
        }
      });
    });
  }

  put(url, body, token) {
    return new Promise(function (resolve, reject) {
      var req = request.put(url).send(body);

      if (token != null) {
        req.set('Authorization', "Bearer " + token);
      }

      req.end(function (error, res) {
        if (res == null || res.status !== 200) {
          reject(error);
        } else {
          resolve(JSON.parse(res.text));
        }
      });
    });
  }

  upload(url, data, token, progressCallback) {
    return new Promise(function (resolve, reject) {
      const req = request.post(url).send(data).on('progress', progressCallback);

      if (token != null) {
        req.set('Authorization', "Bearer " + token);
      }

      req.end(function (error, res) {
        if (res == null || res.status !== 200) {
          reject(error);
        } else {
          resolve(JSON.parse(res.text));
        }
      });
    });
  }
}

export default new RestAPI();
