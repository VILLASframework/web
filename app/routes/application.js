import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(ApplicationRouteMixin, {
  sessionUser: service('session-user'),

  beforeModel() {
    return this._loadCurrentUser();
  },

  sessionAuthenticated() {
    this._loadCurrentUser().then(() => {
      this.transitionTo('/');
    }).catch(function(/* reason */) {
      //console.log(reason);
      this.get('session').invalidate();
    });
  },

  _loadCurrentUser() {
    return this.get('sessionUser').loadCurrentUser();
  }
});
