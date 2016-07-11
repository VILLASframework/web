import Ember from 'ember';

export default Ember.Controller.extend({
  users: function() {
    var filteredUsers = this.get('model');
    filteredUsers.forEach(function(user) {
      // catch undefined user
      if (user) {
        if (user.get('id') === 'me') {
          filteredUsers.removeObject(user);
        }
      }
    });

    return filteredUsers;
  }.property('model.@each')
});
