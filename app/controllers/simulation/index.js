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
      let simulators = this.get('model.simulators');
      this.set('simulatorName', simulators.toArray()[0].get('name'));
    }
  }.observes('model'),

  actions: {
    showNewModal() {
      // reset properties
      this.set('errorMessage', null);
      this.set('name', null);
      this.set('length', 1);

      // show the dialog
      this.set('isShowingNewModal', true);
    },

    showEditModal(simulationModel) {
      // set properties
      this.set('errorMessage', null);
      this.set('simulationModel', simulationModel);
      this.set('name', simulationModel.get('name'));
      this.set('length', simulationModel.get('length'));

      let simulators = this.get('model.simulators');
      let simulatorId = simulationModel.get('simulator.id');
      let simulatorName = null;

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
      let properties = this.getProperties('name', 'length');
      if (properties['name'] == null || properties['name'] === "") {
        this.set('errorMessage', 'Simulation model name is missing');
        return;
      }

      // set simuatlion properties
      let simulation = this.get('model.simulation');
      properties['simulation'] = simulation;

      // get the simulator by simulator name
      let simulators = this.get('model.simulators');
      let simulatorName = this.get('simulatorName');

      simulators.forEach(function(simulator) {
        if (simulator.get('name') === simulatorName) {
          properties['simulator'] = simulator;
        }
      });

      // create mapping
      let mapping = [];

      for (let i = 0; i < properties['length']; i++) {
        mapping.pushObject("Signal " + (i + 1));
      }

      properties['mapping'] = mapping;

      // create new model
      let simulationModel = this.store.createRecord('simulation-model', properties);

      // this change will not be saved, but it is nessecary otherwise ember will omit the simulation's id in the post request
      simulation.get('models').pushObject(simulationModel);

      let controller = this;

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
      let properties = this.getProperties('name', 'length');
      if (properties['name'] == null || properties['name'] === "") {
        this.set('errorMessage', 'Simulation model name is missing');
        return;
      }

      // set simuatlion properties
      let simulation = this.get('model.simulation');
      properties['simulation'] = simulation;

      // get the simulator by simulator name
      let simulators = this.get('model.simulators');
      let simulatorName = this.get('simulatorName');

      simulators.forEach(function(simulator) {
        if (simulator.get('name') === simulatorName) {
          properties['simulator'] = simulator;
        }
      });

      // save properties
      let controller = this;

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
      let simulationModel = this.get('simulationModel');
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
