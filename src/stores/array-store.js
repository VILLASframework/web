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

  updateElements(state, newElements) {
    // search for existing element to update
    state.forEach((element, index, array) => {
      newElements = newElements.filter((updateElement, newIndex) => {
        if (element._id === updateElement._id) {
          // update each property
          for (var key in updateElement) {
            if (updateElement.hasOwnProperty(key)) {
              array[index][key] = updateElement[key];
            }
          }

          // remove updated element from update list
          return false;
        }

        return true;
      });
    });

    // all elements still in the list will just be added
    state = state.concat(newElements);

    // announce change to listeners
    this.__emitChange();

    return state;
  }

  reduce(state, action) {
    switch (action.type) {
      case this.type + '/start-load':
        if (Array.isArray(action.data)) {
          action.data.forEach((id) => {
            this.dataManager.load(id);
          });
        } else {
          this.dataManager.load(action.data);
        }
        return state;

      case this.type + '/loaded':
        if (Array.isArray(action.data)) {
          return this.updateElements(state, action.data);
        } else {
          return this.updateElements(state, [action.data]);
        }

      case this.type + '/load-error':
        // TODO: Add error message
        return state;

      case this.type + '/start-add':
        this.dataManager.add(action.data);
        return state;

      case this.type + '/added':
        return this.updateElements(state, [action.data]);

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
        return this.updateElements(state, [action.data]);

      case this.type + '/edit-error':
        // TODO: Add error message
        return state;

      default:
        return state;
    }
  }
}

export default ArrayStore;
