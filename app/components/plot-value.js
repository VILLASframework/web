/**
 * File: plot-value.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import PlotAbstract from './plot-abstract';
import Ember from 'ember';

export default PlotAbstract.extend({
  classNames: [ 'plotValue' ],

  minWidth_resize: 50,
  minHeight_resize: 20,

  _updateDataObserver: Ember.on('init', Ember.observer('plot.simulator', 'plot.signal', function() {
    let query = 'data.' + this.get('plot.simulator') + '.sequence';
    this.addObserver(query, function() {
      // get value from array
      let values = this.get('data.' + this.get('plot.simulator') + '.values');
      if (values) {
        this.set('value', values[this.get('plot.signal')]);
      } else {
        this.set('value', null);
      }
    });
  })),

  doubleClick() {
    if (this.get('editing') === true) {
      // prepare modal
      this.set('name', this.get('plot.name'));

      // get signal mapping for simulation model
      let self = this;
      let simulatorid = this.get('plot.simulator');

      this.get('plot.visualization').then((visualization) => {
        visualization.get('project').then((project) => {
          project.get('simulation').then((simulation) => {
            simulation.get('models').then((simulationModels) => {
              // find simulation model by simulatorid
              simulationModels.forEach(function(simulationModel) {
                simulationModel.get('simulator').then((simulator) => {
                  if (simulator.get('simulatorid') === simulatorid) {
                    // set simulation model
                    self.set('simulationModel', simulationModel);
                    self.set('simulationModelName', simulationModel.get('name'));

                    // set signal
                    let mapping = simulationModel.get('mapping');
                    self.set('signalName', mapping[self.get('plot.signal')]);
                  }
                });
              });
            });
          });
        });
      });

      // shot modal
      this.set('isShowingModal', true);
    }
  },

  actions: {
    submitModal() {
      // verify properties
      let properties = this.getProperties('name');
      if (properties['name'] === null || properties['name'] === "") {
        this.set('errorMessage', 'Plot name is missing');
        return;
      }

      // set simulator by simulation model name
      let simulationModelName = this.get('simulationModelName');
      let self = this;

      this.get('plot.visualization').then((visualization) => {
        visualization.get('project').then((project) => {
          project.get('simulation').then((simulation) => {
            simulation.get('models').then((simulationModels) => {
              // find simulation model by name
              simulationModels.forEach(function(simulationModel) {
                if (simulationModel.get('name') === simulationModelName) {
                  simulationModel.get('simulator').then((simulator) => {
                    // set simulator
                    properties['simulator'] = simulator.get('simulatorid');

                    // set signal by name
                    let mapping = simulationModel.get('mapping');
                    let signalName = self.get('signalName');

                    for (let i = 0; i < mapping.length; i++) {
                      if (mapping[i] === signalName) {
                        properties['signal'] = i;
                      }
                    }

                    // save properties
                    self.get('plot').setProperties(properties);

                    self.get('plot').save().then(function() {
                      self.set('isShowingModal', false);
                    });
                  });
                }
              });
            });
          });
        });
      });
    },

    cancelModal() {
      this.set('isShowingModal', false);
    },

    selectSimulationModel(simulationModelName) {
      // save simulation model
      this.set('simulationModelName', simulationModelName);

      // get signal mapping for simulation model
      let self = this;

      this.get('plot.visualization').then((visualization) => {
        visualization.get('project').then((project) => {
          project.get('simulation').then((simulation) => {
            simulation.get('models').then((simulationModels) => {
              // find simulation model by name
              simulationModels.forEach(function(simulationModel) {
                if (simulationModel.get('name') === simulationModelName) {
                  self.set('simulationModel', simulationModel);
                }
              });
            });
          });
        });
      });
    },

    selectSignal(signalName) {
      this.set('signalName', signalName);
    }
  }
});
