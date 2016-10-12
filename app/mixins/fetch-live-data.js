/**
 * File: fetch-live-data.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 12.10.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Mixin.create({
  data: {},

  _getData: function() {
    // check if simulation is running
    let self = this;

    this.get('model.project').then((project) => {
      project.get('simulation').then((simulation) => {
        if (simulation.get('running')) {
          // get all models to access data
          simulation.get('models').then((simulationModels) => {
            simulationModels.forEach(function(simulationModel) {
              // get simulator
              simulationModel.get('simulator').then((simulator) => {
                let simulatorID = simulator.get('simulatorid');
                if (simulatorID) {
                  // add simulation data to list
                  self._loadDataForSimulator(simulatorID);
                } else {
                  Ember.debug('undefined simulator id');
                }
              });
            });
          });
        } else {
          // clear simulation data
          this.set('data', {});

          //Ember.debug('Simulation not running');

          // check again if simulation is running
          Ember.run.later(this, function() {
            // trigger _getData observer
            this.notifyPropertyChange('model');
          }, 1000);
        }
      });
    });
  }.observes('model'),

  _loadDataForSimulator(simulatorID) {
    // get data by simulator id
    let simulationData = this.store.peekRecord('simulation-data', simulatorID);
    if (simulationData) {
      // add data to list
      this.get('data')[simulatorID] = simulationData;

      // notify object for property changes
      this.notifyPropertyChange('data.' + simulatorID + '.values');
    } else {
      // try to load data later
      Ember.run.later(this, function() {
        this._loadDataForSimulator(simulatorID);
      }, 1000);
    }
  }
});
