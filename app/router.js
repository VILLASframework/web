import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');

  this.route('projects');
  this.route('project', function() {
    this.route('index', { path: '/:projectid' });
    this.route('new');
    this.route('edit', { path: '/edit/:projectid' });
    this.route('delete', { path: '/delete/:projectid' });
  });

  this.route('user', function() {
    this.route('edit');
  });
  this.route('visualization', function() {
    this.route('index', { path: '/:visualizationid' });
    this.route('new');
    this.route('edit', { path: '/edit/:visualizationid' });
    this.route('delete', { path: '/delete/:visualizationid' });
  });
});

export default Router;
