/**
 * File: index.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 30.09.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  isShowingNewModal: false,
  isShowingEditModal: false,
  isShowingDeleteModal: false,

  errorMessage: null,

  simulationModel: null,
  simulatorName: null,

  _updateSimulators: function() {
    if (this.get('model.simulators') != null && this.get('model.simulators.length') > 0) {
      var simulators = this.get('model.simulators');
      this.set('simulatorName', simulators.toArray()[0].get('name'));
    }
  }.observes('model'),

  actions: {
    showNewModal() {
      // reset properties
      this.set('errorMessage', null);
      this.set('name', null);

      // show the dialog
      this.set('isShowingNewModal', true);
    },

    showEditModal(simulationModel) {
      // set properties
      this.set('errorMessage', null);
      this.set('simulationModel', simulationModel);
      this.set('name', simulationModel.get('name'));

      var simulators = this.get('model.simulators');
      var simulatorId = simulationModel.get('simulator.id');
      var simulatorName = null;

      simulators.forEach(function(simulator) {
        if (simulator.get('id') === simulatorId) {
          simulatorName = simulator.get('name');
        }
      });

      this.set('simulatorName', simulatorName);

      // show the dialog
      this.set('isShowingEditModal', true);
    },

    showDeleteModal(simulationModel) {
      // set properties
      this.set('simulationModel', simulationModel);

      // show the dialog
      this.set('isShowingDeleteModal', true);
    },

    submitNew() {
      // verify properties
      var properties = this.getProperties('name');
      if (properties['name'] == null || properties['name'] === "") {
        this.set('errorMessage', 'Simulation model name is missing');
        return;
      }

      // set simuatlion properties
      var simulation = this.get('model.simulation');
      properties['simulation'] = simulation;

      // get the simulator id by simulator name
      var simulators = this.get('model.simulators');
      var simulatorName = this.get('simulatorName');

      simulators.forEach(function(simulator) {
        if (simulator.get('name') === simulatorName) {
          properties['simulator'] = simulator;
        }
      });

      // create new model
      var simulationModel = this.store.createRecord('simulation-model', properties);

      // this change will not be saved, but it is nessecary otherwise ember will omit the simulation's id in the post request
      simulation.get('models').pushObject(simulationModel);

      var controller = this;

      simulationModel.save().then(function() {
        controller.set('isShowingNewModal', false);
      }, function() {
        Ember.debug('Error saving new model');
      });
    },

    cancelNew() {
      this.set('isShowingNewModal', false);
    },

    submitEdit() {
      // verify properties
      var properties = this.getProperties('name');
      if (properties['name'] == null || properties['name'] === "") {
        this.set('errorMessage', 'Simulation model name is missing');
        return;
      }

      // set simuatlion properties
      var simulation = this.get('model.simulation');
      properties['simulation'] = simulation.get('id');

      // get the simulator id by simulator name
      var simulators = this.get('model.simulators');
      var simulatorId = null;
      var simulatorName = this.get('simulatorName');

      simulators.forEach(function(simulator) {
        if (simulator.get('name') === simulatorName) {
          simulatorId = simulator.get('simulatorid');
        }
      });

      if (simulatorId == null) {
        Ember.debug('Unable to find simulator by name');
        return;
      }

      properties['simulator'] = simulatorId;

      // save properties
      var controller = this;

      this.get('simulationModel').setProperties(properties);

      this.get('simulationModel').save().then(function() {
        controller.set('isShowingEditModal', false);
      }, function() {
        Ember.debug('Error saving edit simulation model');
      });
    },

    cancelEdit() {
      this.set('isShowingEditModal', false);
    },

    confirmDelete() {
      // delete the model
      var simulationModel = this.get('simulationModel');
      simulationModel.destroyRecord();

      // hide the dialog
      this.set('isShowingDeleteModal', false);
    },

    cancelDelete() {
      this.set('isShowingDeleteModal', false);
    },

    selectSimulator(simulator) {
      this.set('simulatorName', simulator);
    }
  }
});
