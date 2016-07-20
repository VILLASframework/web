/**
 * File: edit.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 11.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    saveEdit() {
      // save the changes
      var user = this.get('model');
      var controller = this;

      user.save().then(function() {
        controller.transitionToRoute('/user/');
      });
    },

    cancelEdit() {
      this.transitionToRoute('/user/');
    }
  }
});
