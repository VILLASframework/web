/**
 * File: index.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  _setSignalNames: Ember.observer('model', 'model.length', function() {
    // loop through signals
    let length = this.get('model.length');
    let mapping = this.get('model.mapping');

    for (let i = 0; i < length; i++) {
      this.set('name' + i, mapping[i]);
    }
  }),

  actions: {
    saveMapping() {
      // save all signal names
      let length = this.get('model.length');
      let mapping = this.get('model.mapping');

      for (let i = 0; i < length; i++) {
        mapping[i] = this.get('name' + i);
      }

      this.set('model.mapping', mapping);

      // save the changed model
      let self = this;

      this.get('model').save().then(function() {
        // go back to simulation
        self.get('model.simulation').then((simulation) => {
          self.transitionToRoute('/simulation/' + simulation.get('id'));
        });
      }, function() {
        Ember.debug('Unable to save simulation model');
      });
    }
  }
});
