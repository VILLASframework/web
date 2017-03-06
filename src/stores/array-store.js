/**
 * File: array-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import { ReduceStore } from 'flux/utils';

import AppDispatcher from '../app-dispatcher';

class ArrayStore extends ReduceStore {
  constructor(type, dataManager) {
    super(AppDispatcher);

    this.type = type;
    this.dataManager = dataManager;
  }

  getInitialState() {
    return [];
  }

  reduce(state, action) {
    var array;

    switch (action.type) {
      case this.type + '/start-load':
        this.dataManager.load();
        return state;

      case this.type + '/loaded':
        return action.data;

      case this.type + '/load-error':
        // TODO: Add error message
        return state;

      case this.type + '/start-add':
        this.dataManager.add(action.data);
        return state;

      case this.type + '/added':
        // signal array change since its not automatically detected
        state.push(action.data);
        this.__emitChange();

        return state;

      case this.type + '/add-error':
        // TODO: Add error message
        return state;

      case this.type + '/start-remove':
        this.dataManager.remove(action.data);
        return state;

      case this.type + '/removed':
        return state.filter((item) => {
          return (item !== action.original);
        });

      case this.type + '/remove-error':
        // TODO: Add error message
        return state;

      case this.type + '/start-edit':
        this.dataManager.update(action.data);
        return state;

      case this.type + '/edited':
        array = state.slice();
        for (var i = 0; i < array.length; i++) {
          if (array[i]._id === action.data._id) {
            array[i] = action.data;
          }
        }

        return array;

      case this.type + '/edit-error':
        // TODO: Add error message
        return state;

      default:
        return state;
    }
  }
}

export default ArrayStore;
