import Ember from 'ember';

export default Ember.Controller.extend({
  sessionUser: Ember.inject.service('session-user'),

  actions: {
    cancelDelete() {
      // go back to project view
      let projectId = this.get('model.id');
      this.transitionToRoute('/project/' + projectId);
    },

    confirmDelete() {
      // get current user object
      var userId = this.get('sessionUser.user.id');
      var user = this.store.peekRecord('user', userId);

      // get the project
      var project = this.get('model');
      let projectId = project.get('id');

      // delete the project and remove from user projects
      var visualizations = project.get('visualizations');
      visualizations.forEach(function(visualization) {
        // destroy all plots
        var plots = visualization.get('plots');
        plots.forEach(function(plot) {
          plot.destroyRecord();
        });

        visualization.destroyRecord();
      });

      project.destroyRecord();

      // save the changes to project
      var controller = this;

      user.get('projects').removeObject(projectId);
      user.save().then(function() {
        controller.transitionToRoute('/projects');
      });
    }
  }
});
