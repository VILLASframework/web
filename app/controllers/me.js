import Ember from 'ember';

export default Ember.Controller.extend({
  isAdmin: function() {
    var level = this.get('model.adminLevel');
    return level >= 1;
  }.property('model'),

  actions: {
    changeUser() {
      // save the changes
      var user = this.get('model');
      user.save();
    }
  }
});
