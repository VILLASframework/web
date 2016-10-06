/**
 * File: project.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  sessionUser: Ember.inject.service('session-user'),

  model() {
    // get projects for current user, simulations are needed for the simulation picker
    var user = this.get('sessionUser.user');

    return Ember.RSVP.hash({
      projects: user.get('projects'),
      simulations: this.store.findAll('simulation')
    });
  }
});
