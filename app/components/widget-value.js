/**
 * File: widget-value.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import WidgetAbstract from './widget-abstract';
import Ember from 'ember';

export default WidgetAbstract.extend({
  classNames: [ 'widgetValue' ],

  minWidth_resize: 50,
  minHeight_resize: 20,

  observeQuery: null,

  _updateDataObserver: Ember.on('init', Ember.observer('widget.widgetData.simulator', 'widget.widgetData.signal', function() {
    // update observer
    let query = 'data.' + this.get('widget.widgetData.simulator') + '.sequence';
    let observeQuery = this.get('observeQuery');
    if (observeQuery != null) {
      this.removeObserver(observeQuery, this._updateData);
    }

    this.addObserver(query, this._updateData);
    this.set('observeQuery', query);
  })),

  _updateData() {
    // get value from array
    let values = this.get('data.' + this.get('widget.widgetData.simulator') + '.values');
    if (values) {
      this.set('value', values[this.get('widget.widgetData.signal')]);
    } else {
      this.set('value', null);
    }
  },

  doubleClick() {
    if (this.get('editing') === true) {
      // prepare modal
      this.set('name', this.get('widget.name'));

      // get signal mapping for simulation model
      let self = this;
      let simulatorid = this.get('widget.widgetData.simulator');

      this.get('widget.visualization').then((visualization) => {
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
                    self.set('signalName', mapping[self.get('widget.widgetData.signal')]);
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

                    // set signal by name
                    let mapping = simulationModel.get('mapping');
                    let signalName = self.get('signalName');

                    for (let i = 0; i < mapping.length; i++) {
                      if (mapping[i] === signalName) {
                        widgetData.signal = i;
                      }
                    }

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

      // get signal mapping for simulation model
      let self = this;

      this.get('widget.visualization').then((visualization) => {
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
