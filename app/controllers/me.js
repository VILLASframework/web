/**
 * File: me.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  isAdmin: Ember.computed('model', function() {
    var level = this.get('model.adminLevel');
    return level >= 1;
  }),

  actions: {
    changeUser() {
      // save the changes
      var user = this.get('model');
      user.save();
    }
  }
});
