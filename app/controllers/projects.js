/**
 * File: projects.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 01.10.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Controller.extend({
  sessionUser: Ember.inject.service('session-user'),

  isShowingNewModal: false,
  isShowingEditModal: false,
  isShowingDeleteModal: false,

  errorMessage: null,

  project: null,
  projectSimulation: null,

  _updateSimulations: function() {
    if (this.get('model.simulations') != null && this.get('model.simulations.length') > 0) {
      var simulations = this.get('model.simulations');
      this.set('projectSimulation', simulations.toArray()[0]);
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

    showEditModal(project) {
      // set properties
      this.set('errorMessage', null);
      this.set('project', project);
      this.set('name', project.get('name'));
      this.set('projectSimulation', project.get('simulation'));

      // show the dialog
      this.set('isShowingEditModal', true);
    },

    showDeleteModal(project) {
      // set properties
      this.set('project', project);

      // show the dialog
      this.set('isShowingDeleteModal', true);
    },

    submitNew() {
      // verify properties
      var properties = this.getProperties('name');
      if (properties['name'] == null || properties['name'] === "") {
        this.set('errorMessage', 'Project name is missing');
        return;
      }

      // set owner property
      var user = this.get('sessionUser.user');
      properties['owner'] = user;

      // set simulation property
      properties['simulation'] = this.get('projectSimulation.id');

      // create new project
      var project = this.store.createRecord('project', properties);

      // this change will not be saved, but it is nessecary otherwise ember will omit the simulation's id in the post request
      this.get('projectSimulation.projects').pushObject(project);

      var controller = this;

      project.save().then(function() {
        controller.set('isShowingNewModal', false);
      }, function() {
        Ember.debug('Error saving new project');
      });
    },

    cancelNew() {
      this.set('isShowingNewModal', false);
    },

    submitEdit() {
      // verify properties
      var properties = this.getProperties('name');
      if (properties['name'] == null || properties['name'] === "") {
        this.set('errorMessage', 'Project name is missing');
        return;
      }

      // remove from old simulation


      // save properties
      properties['simulation'] = this.get('projectSimulation.id');

      this.get('project').setProperties(properties);

      // this change will not be saved, but it is nessecary otherwise ember will omit the simulation's id in the post request
      this.get('projectSimulation.projects').pushObject(this.get('project'));

      var controller = this;

      this.get('project').save().then(function() {
        controller.set('isShowingEditModal', false);
      }, function() {
        Ember.debug('Error saving edit project');
      });
    },

    cancelEdit() {
      this.set('isShowingEditModal', false);
    },

    confirmDelete() {
      // delete the project
      var project = this.get('project');
      project.destroyRecord();

      // hide the dialog
      this.set('isShowingDeleteModal', false);
    },

    cancelDelete() {
      this.set('isShowingDeleteModal', false);
    },

    selectSimulation(simulationName) {
      // get simulation by name
      var simulations = this.get('model.simulations');
      var controller = this;

      simulations.forEach(function(simulation) {
        if (simulation.get('name') === simulationName) {
          controller.set('projectSimulation', simulation);
        }
      });
    }
  }
});
