/**
 * File: rest-data-manager.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import RestAPI from '../api/rest-api';
import AppDispatcher from '../app-dispatcher';

const API_URL = 'http://localhost:4000/api/v1';

class RestDataManager {
  constructor(type, url) {
    this.url = url;
    this.type = type;
  }

  makeURL(part) {
    return API_URL + part;
  }

  load(id) {
    if (id != null) {
      // load single object
      RestAPI.get(this.makeURL(this.url + '/' + id)).then(response => {
        AppDispatcher.dispatch({
          type: this.type + 's/loaded',
          data: response[this.type]
        });
      }).catch(error => {
        AppDispatcher.dispatch({
          type: this.type + 's/load-error',
          error: error
        });
      });
    } else {
      // load all objects
      RestAPI.get(this.makeURL(this.url)).then(response => {
        AppDispatcher.dispatch({
          type: this.type + 's/loaded',
          data: response[this.type + 's']
        });
      }).catch(error => {
        AppDispatcher.dispatch({
          type: this.type + 's/load-error',
          error: error
        });
      });
    }
  }

  add(object) {
    var obj = {};
    obj[this.type] = object;

    RestAPI.post(this.makeURL(this.url), obj).then(response => {
      AppDispatcher.dispatch({
        type: this.type + 's/added',
        data: response[this.type]
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: this.type + 's/add-error',
        error: error
      });
    });
  }

  remove(object) {
    RestAPI.delete(this.makeURL(this.url + '/' + object._id)).then(response => {
      AppDispatcher.dispatch({
        type: this.type + 's/removed',
        data: response[this.type],
        original: object
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: this.type + 's/remove-error',
        error: error
      });
    });
  }

  update(object) {
    var obj = {};
    obj[this.type] = object;

    RestAPI.put(this.makeURL(this.url + '/' + object._id), obj).then(response => {
      AppDispatcher.dispatch({
        type: this.type + 's/edited',
        data: response[this.type]
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: this.type + 's/edit-error',
        error: error
      });
    });
  }
};

export default RestDataManager;
