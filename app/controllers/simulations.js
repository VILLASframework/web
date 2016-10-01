/**
 * File: simulation.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 30.09.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  sessionUser: Ember.inject.service('session-user'),

  isShowingNewModal: false,
  isShowingEditModal: false,
  isShowingEditModal: false,

  errorMessage: null,

  simulation: null,

  actions: {
    showNewModal() {
      // reset properties
      this.set('errorMessage', null);
      this.set('name', null);

      // show the dialog
      this.set('isShowingNewModal', true);
    },

    showEditModal(simulation) {
      // set properties
      this.set('errorMessage', null);
      this.set('simulation', simulation);
      this.set('name', simulation.get('name'));

      // show the dialog
      this.set('isShowingEditModal', true);
    },

    showDeleteModal(simulation) {
      // set properties
      this.set('simulation', simulation);

      // show the dialog
      this.set('isShowingDeleteModal', true);
    },

    submitNew() {
      // verify properties
      var properties = this.getProperties('name');
      if (properties['name'] == null || properties['name'] == "") {
        this.set('errorMessage', 'Simulation name is missing');
        return;
      }

      // set owner properties
      var user = this.get('sessionUser.user');
      properties['owner'] = user;

      // create new simulation
      var simulation = this.store.createRecord('simulation', properties);
      var controller = this;

      simulation.save().then(function() {
        controller.set('isShowingNewModal', false);
      }, function() {
        Ember.debug('Error saving new simulation');
      });
    },

    cancelNew() {
      this.set('isShowingNewModal', false);
    },

    submitEdit() {
      // verify properties
      var properties = this.getProperties('name');
      if (properties['name'] == null || properties['name'] == "") {
        this.set('errorMessage', 'Simulation name is missing');
        return;
      }

      // save properties
      this.get('simulation').set('name', properties['name']);

      var controller = this;

      this.get('simulation').save().then(function() {
        controller.set('isShowingEditModal', false);
      }, function() {
        Ember.debug('Error saving edit simulation');
      });
    },

    cancelEdit() {
      this.set('isShowingEditModal', false);
    },

    confirmDelete() {
      // delete the simulation
      var simulation = this.get('simulation');
      simulation.destroyRecord();

      // hide the dialog
      this.set('isShowingDeleteModal', false);
    },

    cancelDelete() {
      this.set('isShowingDeleteModal', false);
    }
  }
});
