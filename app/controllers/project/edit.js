import Ember from 'ember';

export default Ember.Controller.extend({
  name: function() {
    return this.get('model.name');
  }.property('model.name'),

  actions: {
    saveEdit() {
      // apply the changes
      var project = this.get('model');
      project.set('name', this.get('name'));

      // save the changes
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
