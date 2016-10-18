/**
 * File: index.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 11.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  users: Ember.computed('model.@each', function() {
    var filteredUsers = this.get('model');
    filteredUsers.forEach(function(user) {
      // catch undefined user
      if (user) {
        if (user.get('id') === 'me') {
          filteredUsers.removeObject(user);
        }
      }
    });

    return filteredUsers;
  })
});
