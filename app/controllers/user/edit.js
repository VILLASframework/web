import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    saveEdit() {
      // save the changes
      var user = this.get('model');
      var controller = this;

      user.save().then(function() {
        controller.transitionToRoute('/user/');
      });
    },

    cancelEdit() {
      this.transitionToRoute('/user/');
    }
  }
});
