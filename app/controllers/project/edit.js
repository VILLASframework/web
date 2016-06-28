import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    saveEdit() {
      // save the changes
      var project = this.get('model');
      let projectId = project.get('id');
      var controller = this;

      project.save().then(function() {
        controller.transitionToRoute('/project/' + projectId);
      });
    },

    cancelEdit() {
      let projectId = this.get('model.id');
      this.transitionToRoute('/project/' + projectId);
    }
  }
});
