/**
 * File: rest-api.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

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
