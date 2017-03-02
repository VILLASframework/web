/**
 * File: villas-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import { ReduceStore } from 'flux/utils';

import AppDispatcher from '../app-dispatcher';

class VillasStore extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    return {};
  }

  reduce(state, action) {
    switch (action.type) {
      default:
        return state;
    }
  }
}

export default new VillasStore();
