/**
 * File: rest-data-manager.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2017
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

import RestAPI from '../api/rest-api';
import AppDispatcher from '../app-dispatcher';

const API_URL = '/api/v2';

class RestDataManager {
  constructor(type, url, keyFilter) {
    this.url = url;
    this.type = type;
    this.keyFilter = keyFilter;
    this.onLoad = null;
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

  requestURL(form, id, param, object = null){
    switch(form){
      case 'load/add':
        if (param === null){
          if(id != null){
            return this.makeURL(this.url + '/' + id);
          }
          else {
            return this.makeURL(this.url);
          }
        }
        else{
          if(id != null){
            return this.makeURL(this.url + '/' + id + param);
          }
          else {
            return this.makeURL(this.url + param)
          }
        }
      case 'remove/update':
        if(param === null){
          return this.makeURL(this.url + '/' + object.id);
        }
        else{
          return this.makeURL(this.url + '/' + object.id + param);
        }
        default:
            console.log("something went wrong");
            break;
    }
  }

  load(id, token = null,param = null) {
      if (id != null) {
        // load single object
        RestAPI.get(this.requestURL('load/add',id,param), token).then(response => {
          let data;
          if (response.hasOwnProperty(this.type)) {
            data = this.filterKeys(response[this.type]);
          }else{
            // loaded file
              data = response;
          }

          AppDispatcher.dispatch({
            type: this.type + 's/loaded',
            data: data,
            token: token
          });

          if (this.onLoad != null) {
            this.onLoad(data);
          }
        }).catch(error => {
          AppDispatcher.dispatch({
            type: this.type + 's/load-error',
            error: error
          });
        });
      } else {
        // load all objects
        RestAPI.get(this.requestURL('load/add',id,param), token).then(response => {
          const data = response[this.type + 's'].map(element => {
            return this.filterKeys(element);
          });

          AppDispatcher.dispatch({
            type: this.type + 's/loaded',
            data: data,
            token: token,
          });

          if (this.onLoad != null) {
            this.onLoad(data);
          }
        }).catch(error => {
          AppDispatcher.dispatch({
            type: this.type + 's/load-error',
            error: error
          });
        });
      }
    }


  add(object, token = null, param = null) {
    var obj = {};
    obj[this.type] = this.filterKeys(object);

    RestAPI.post(this.requestURL('load/add',null,param), obj, token).then(response => {
        AppDispatcher.dispatch({
          type: this.type + 's/added',
          data: response[this.type],
          token: token
        });
      }).catch(error => {
        AppDispatcher.dispatch({
          type: this.type + 's/add-error',
          error: error
        });
      });
  }

  remove(object, token = null, param = null) {
    RestAPI.delete(this.requestURL('remove/update',null,param,object), token).then(response => {
        AppDispatcher.dispatch({
          type: this.type + 's/removed',
          data: response[this.type],
          original: object,
          token: token
        });
      }).catch(error => {
        AppDispatcher.dispatch({
          type: this.type + 's/remove-error',
          error: error
        });
      });
    }

  update(object, token = null, param = null) {
    var obj = {};
    obj[this.type] = this.filterKeys(object);

    RestAPI.put(this.requestURL('remove/update',null,param,object), obj, token).then(response => {
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
