/**
 * File: router.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('logout');

  this.route('projects');
  this.route('project', function() {
    this.route('index', { path: '/:projectid' });
  });

  this.route('me');

  this.route('visualization', function() {
    this.route('index', { path: '/:visualizationid' });
    this.route('new');
    this.route('edit', { path: '/edit/:visualizationid' });
    this.route('delete', { path: '/delete/:visualizationid' });
  });

  this.route('user', function() {
    this.route('edit', { path: '/edit/:userid' });
    this.route('new');
    this.route('delete', { path: '/delete/:userid' });
  });

  this.route('404', { path: '/*path' });

  this.route('simulation-model', function() {
    this.route('index', { path: '/:modelid' });
  });

  this.route('simulations');
  this.route('simulation', function() {
    this.route('index', { path: '/:simulationid' });
  });

  this.route('simulators');
  this.route('simulator');

  this.route('dialog', function() {
    this.route('plot', function() {});
  });
});

export default Router;
