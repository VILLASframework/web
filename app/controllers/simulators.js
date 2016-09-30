/**
 * File: simulators.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 30.09.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  isShowingNewModal: false,
  isShowingDeleteModal: false,
  isShowingEditModal: false,

  simulatorid: 1,
  errorMessage: null,
  simulator: null,
  simulatorName: null,
  simulatorEdit: null,

  actions: {
    showNewModal() {
      // reset the properties
      this.set('errorMessage', null);
      this.set('simulatorid', 1);
      this.set('name', null);
      this.set('endpoint', null);

      // show the modal dialog
      this.set('isShowingNewModal', true);
    },

    showDeleteModal(simulator) {
      this.set('isShowingDeleteModal', true);
      this.set('simulator', simulator);
    },

    showEditModal(simulator) {
      // set properties
      this.set('errorMessage', null);
      this.set('simulator', simulator);
      this.set('simulatorid', simulator.get('simulatorid'));
      this.set('simulatorName', simulator.get('name'));
      this.set('simulatorEndpoint', simulator.get('endpoint'));

      // show the modal dialog
      this.set('isShowingEditModal', true);
    },

    newSimulator() {
      // verify properties
      var properties = this.getProperties('name', 'simulatorid', 'endpoint');
      if (properties['name'] == null) {
        this.set('errorMessage', 'Simulator name is missing');
        return;
      } else if (properties['endpoint'] == null) {
        this.set('errorMessage', 'Simulator endpoint is missing');
        return;
      }

      // create new simulator from properties
      var simulator = this.store.createRecord('simulator', properties);
      var controller = this;

      simulator.save().then(function() {
        controller.set('isShowingNewModal', false);
      }, function() {
        Ember.debug('Error saving new simulator');
      });
    },

    cancelNewSimulator() {
      this.set('isShowingNewModal', false);
    },

    cancelDeleteSimulator() {
      this.set('isShowingDeleteModal', false);
    },

    confirmDeleteSimulator() {
      // delete the simulator
      var simulator = this.get('simulator');
      simulator.destroyRecord();

      // hide the modal dialog
      this.set('isShowingDeleteModal', false);
    },

    editSimulator() {
      // verify new properties
      if (this.get('simulatorName') == null) {
        this.set('errorMessage', 'Simulator name is missing');
        return;
      } else if (this.get('simulatorEndpoint') == null) {
        this.set('errorMessage', 'Simulator endpoint is missing');
        return;
      }

      // save property changes
      this.get('simulator').set('name', this.get('simulatorName'));
      this.get('simulator').set('simulatorid', this.get('simulatorid'));
      this.get('simulator').set('endpoint', this.get('simulatorEndpoint'));

      var controller = this;

      this.get('simulator').save().then(function() {
        controller.set('isShowingEditModal', false);
      }, function() {
        Ember.debug('Error saving edit simulator');
      });
    },

    cancelEditSimulator() {
      this.set('isShowingEditModal', false);
    }
  }
});
