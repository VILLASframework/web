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

const API_URL = 'http://localhost:4000/api/v1';

function makeURL(part) {
  // TODO: Add / if missing at front of part
  return API_URL + part;
}

class RestAPI {
  get(url) {
    return new Promise(function (resolve, reject) {
      request.get(makeURL(url)).end(function (error, res) {
        if (res.status !== 200) {
          reject();
        } else {
          resolve(JSON.parse(res.text));
        }
      });
    });
  }

  post(url, body) {
    return new Promise(function (resolve, reject) {
      request.post(makeURL(url)).send(body).end(function (error, res) {
        if (res.status !== 200) {
          reject();
        } else {
          resolve(JSON.parse(res.text));
        }
      });
    });
  }
}

export default new RestAPI();
