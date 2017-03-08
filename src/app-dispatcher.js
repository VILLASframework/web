/**
 * File: app-dispatcher.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import { Dispatcher } from 'flux';

class AppDispatcher extends Dispatcher {
  dispatch(payload) {
    if (this.isDispatching()) {
      // try again later
      var self = this;

      setTimeout(function() {
        self.dispatch(payload);
      }, 1);
    } else {
      // do actual dispatch
      super.dispatch(payload);
    }
  }
}

export default new AppDispatcher();
