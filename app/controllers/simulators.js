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
  isShowingRunningModal: false,

  simulatorid: 1,
  errorMessage: null,
  simulator: null,
  simulatorName: null,
  simulatorEdit: null,
  simulatorRunning: true,

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

    showRunningModal(simulator) {
      // set properties
      this.set('simulator', simulator);
      this.set('simulatorRunning', simulator.get('running'));

      // show the dialog
      this.set('isShowingRunningModal', true);
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
    },

    confirmRunningSimulation() {
      // set the property
      var simulator = this.get('simulator');
      simulator.set('running', this.get('simulatorRunning'));

      // save property
      var controller = this;

      simulator.save().then(function() {
        controller.set('isShowingRunningModal', false);
      }, function() {
        Ember.debug('Error saving running simulator');
      });
    },

    cancelRunningSimulation() {
      this.set('isShowingRunningModal', false);
    },

    selectRunning(running) {
      // NOTE: running is a string and not a boolean value
      if (running === 'true') {
        this.set('simulatorRunning', true);
      } else {
        this.set('simulatorRunning', false);
      }
    }
  }
});
