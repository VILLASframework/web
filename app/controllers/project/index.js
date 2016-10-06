/**
 * File: index.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
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

  visualization: null,

  actions: {
    showNewModal() {
      // reset properties
      this.set('errorMessage', null);
      this.set('name', null);

      // show the dialog
      this.set('isShowingNewModal', true);
    },

    showEditModal(visualization) {
      // set properties
      this.set('errorMessage', null);
      this.set('visualization', visualization);
      this.set('name', visualization.get('name'));

      // show the dialog
      this.set('isShowingEditModal', true);
    },

    showDeleteModal(visualization) {
      // set properties
      this.set('visualization', visualization);

      // show the dialog
      this.set('isShowingDeleteModal', true);
    },

    submitNew() {
      // verify properties
      var properties = this.getProperties('name');
      if (properties['name'] == null || properties['name'] === "") {
        this.set('errorMessage', 'Visualization name is missing');
        return;
      }

      // set project property
      properties['project'] = this.get('model.id');

      // create new project
      var visualization = this.store.createRecord('visualization', properties);
      var controller = this;

      // this change will not be saved, but it is nessecary otherwise ember will omit the project's id in the post request
      var project = this.get('model');
      project.get('visualizations').pushObject(visualization);

      visualization.save().then(function() {
        controller.set('isShowingNewModal', false);
      }, function() {
        Ember.debug('Error saving new visualization');
      });
    },

    cancelNew() {
      this.set('isShowingNewModal', false);
    },

    submitEdit() {
      // verify properties
      var properties = this.getProperties('name');
      if (properties['name'] == null || properties['name'] === "") {
        this.set('errorMessage', 'Visualization name is missing');
        return;
      }

      // save properties
      this.get('visualization').setProperties(properties);

      var controller = this;

      this.get('visualization').save().then(function() {
        controller.set('isShowingEditModal', false);
      }, function() {
        Ember.debug('Error saving edit visualization');
      });
    },

    cancelEdit() {
      this.set('isShowingEditModal', false);
    },

    confirmDelete() {
      // delete the visualization
      var visualization = this.get('visualization');
      visualization.destroyRecord();

      // hide the dialog
      this.set('isShowingDeleteModal', false);
    },

    cancelDelete() {
      this.set('isShowingDeleteModal', false);
    }
  }
});
