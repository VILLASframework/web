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
  get(url) {
    return new Promise(function (resolve, reject) {
      request.get(url).set('Access-Control-Allow-Origin', '*').end(function (error, res) {
        if (res == null || res.status !== 200) {
          reject(error);
        } else {
          resolve(JSON.parse(res.text));
        }
      });
    });
  }

  post(url, body) {
    return new Promise(function (resolve, reject) {
      request.post(url).send(body).end(function (error, res) {
        if (res == null || res.status !== 200) {
          reject(error);
        } else {
          resolve(JSON.parse(res.text));
        }
      });
    });
  }

  delete(url) {
    return new Promise(function (resolve, reject) {
      request.delete(url).end(function (error, res) {
        if (res == null || res.status !== 200) {
          reject(error);
        } else {
          resolve(JSON.parse(res.text));
        }
      });
    });
  }

  put(url, body) {
    return new Promise(function (resolve, reject) {
      request.put(url).send(body).end(function (error, res) {
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
