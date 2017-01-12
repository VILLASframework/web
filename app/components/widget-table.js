/**
 * File: widget-table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 05.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import WidgetAbstract from './widget-abstract';
import Ember from 'ember';

export default WidgetAbstract.extend({
  classNames: [ 'widgetTable' ],

  minWidth_resize: 200,
  minHeight_resize: 60,

  signals: [],

  _updateDataObserver: Ember.on('init', Ember.observer('widget.widgetData.simulator', function() {
    // get query for observer
    let simulatorId = this.get('widget.widgetData.simulator');
    let query = 'data.' + simulatorId + '.sequence';

    this.addObserver(query, function() {
      // get signal names to fill data in
      let signals = this.get('signals');
      if (!signals) {
        // wait till names are loaded
        return;
      }

      // get values from array
      let values = this.get('data.' + simulatorId + '.values');
      for (let i = 0; i < values.length; i++) {
        if (!signals[i]) {
          break;
        }

        Ember.set(signals[i], 'value', values[i]);
      }
    });

    // get signal names
    let self = this;

    this.get('widget.visualization').then((visualization) => {
      visualization.get('project').then((project) => {
        project.get('simulation').then((simulation) => {
          simulation.get('models').then((simulationModels) => {
            // get simulation model by simulatorId
            simulationModels.forEach((simulationModel) => {
              simulationModel.get('simulator').then((simulator) => {
                if (simulator.get('simulatorid') === simulatorId) {
                  // set signal names
                  let signals = [];

                  simulationModel.get('mapping').forEach((signalName) => {
                    signals.push({ name: signalName, value: null });
                  });

                  self.set('signals', signals);
                }
              });
            });
          });
        });
      });
    });
  })),

  doubleClick() {
    if (this.get('editing') === true) {
      // prepare modal
      this.set('name', this.get('widget.name'));

      // get simlator name from id
      let self = this;
      let simulatorid = this.get('widget.widgetData.simulator');

      this.get('widget.visualization').then((visualization) => {
        visualization.get('project').then((project) => {
          project.get('simulation').then((simulation) => {
            simulation.get('models').then((simulationModels) => {
              // find simulation model by simulatorid
              simulationModels.forEach((simulationModel) => {
                simulationModel.get('simulator').then((simulator) => {
                  if (simulator.get('simulatorid') === simulatorid) {
                    // set simulation model
                    self.set('simulationModel', simulationModel);
                    self.set('simulationModelName', simulationModel.get('name'));
                  }
                });
              });
            });
          });
        });
      });

      // show modal
      this.set('isShowingModal', true);
    }
  },

  actions: {
    submitModal() {
      // verify properties
      let properties = this.getProperties('name');

      if (properties['name'] === null || properties['name'] === "") {
        this.set('errorMessage', 'Widget name is missing');
        return;
      }

      // set simulator by simulation model name
      let simulationModelName = this.get('simulationModelName');
      let self = this;

      this.get('widget.visualization').then((visualization) => {
        visualization.get('project').then((project) => {
          project.get('simulation').then((simulation) => {
            simulation.get('models').then((simulationModels) => {
              // find simulation model by name
              simulationModels.forEach(function(simulationModel) {
                if (simulationModel.get('name') === simulationModelName) {
                  simulationModel.get('simulator').then((simulator) => {
                    // set simulator
                    let widgetData = {};
                    widgetData.simulator = simulator.get('simulatorid');

                    // save properties
                    properties['widgetData'] = widgetData;

                    self.get('widget').setProperties(properties);

                    self.get('widget').save().then(function() {
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

    deleteModal() {
      // delete widget
      this.get('widget').destroyRecord();

      this.set('isShowingModal', false);
    },

    selectSimulationModel(simulationModelName) {
      // save simulation model
      this.set('simulationModelName', simulationModelName);
    }
  }
});
