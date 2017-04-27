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

class RestAPI {
  get(url, token) {
    return new Promise(function (resolve, reject) {
      var req = request.get(url);

      if (token != null) {
        req.set('x-access-token', token);
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
      var req = request.post(url).send(body);

      if (token != null) {
        req.set('x-access-token', token);
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

  delete(url, token) {
    return new Promise(function (resolve, reject) {
      var req = request.delete(url);

      if (token != null) {
        req.set('x-access-token', token);
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
        req.set('x-access-token', token);
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

  upload(url, data, token) {
    return new Promise(function (resolve, reject) {
      var req = request.post(url).send(data);

      if (token != null) {
        req.set('x-access-token', token);
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
