/**
 * File: session-user.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

const {
  inject: { service },
  RSVP
} = Ember;

export default Ember.Service.extend({
  session: service('session'),
  store: service(),

  loadCurrentUser() {
    var _this = this;

    return new RSVP.Promise((resolve, reject) => {
      const token = this.get('session.data.authenticated.token');
      if (!Ember.isEmpty(token)) {
        return this.get('store').findRecord('user', 'me').then(function(user) {
          _this.set('user', user);
          resolve();
        }, function() {
          _this.get('session').invalidate();
          reject();
        });
      } else {
        resolve();
      }
    });
  }
});
