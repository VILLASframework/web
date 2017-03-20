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
  constructor(type, url, keyFilter) {
    this.url = url;
    this.type = type;
    this.keyFilter = keyFilter;
  }

  makeURL(part) {
    return API_URL + part;
  }

  filterKeys(object) {
    // don't change anything if no filter is set
    if (this.keyFilter == null || Array.isArray(this.keyFilter) === false) {
      return object;
    }

    // remove all keys not in the filter
    Object.keys(object).filter(key => {
      return this.keyFilter.indexOf(key) === -1;
    }).forEach(key => {
      delete object[key];
    });

    return object;
  }

  load(id) {
    if (id != null) {
      // load single object
      RestAPI.get(this.makeURL(this.url + '/' + id)).then(response => {
        const data = this.filterKeys(response[this.type]);

        AppDispatcher.dispatch({
          type: this.type + 's/loaded',
          data: data
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
        const data = response[this.type + 's'].map(element => {
          return this.filterKeys(element);
        });

        AppDispatcher.dispatch({
          type: this.type + 's/loaded',
          data: data
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
    obj[this.type] = this.filterKeys(object);

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
    obj[this.type] = this.filterKeys(object);

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
