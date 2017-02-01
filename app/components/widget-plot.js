/**
 * File: widget-value.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 08.12.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';
import WidgetAbstract from './widget-abstract';

export default WidgetAbstract.extend({
  classNames: [ 'widgetPlot' ],

  plotData: Ember.A([]),

  plotOptions: {
    series: {
      lines: {
        show: true,
        lineWidth: 2
      },
      shadowSize: 0
    },
    xaxis: {
      mode: 'time',
      timeformat: '%M:%S',
      axisLabel: 'time [min]',
      axisLabelUseCanvas: true
    }/*,
    yaxis: {
      tickDecimals: 1,
      axisLabel: this.data.get('type'),
      axisLabelUseCanvas: true
    }*/
  },

  signals: Ember.A([]),
  checkedSignals: {},
  plotType: "multiple",
  time: null,
  observeQuery: null,
  selectedSignal: null,

  _updateDataObserver: Ember.on('init', Ember.observer('widget.widgetData.simulator', 'widget.widgetData.type', 'widget.widgetData.signals', function() {
    // get query for observer
    let simulatorId = this.get('widget.widgetData.simulator');
    let query = 'data.' + simulatorId + '.sequence';

    // get plot settings
    let signals = this.get('widget.widgetData.signals');
    this.set('signals', signals);

    let plotType = this.get('widget.widgetData.type');
    this.set('plotType', plotType);

    if (plotType === 'table') {
      // set simulation model for table with signals
      var self = this;
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

                    if (self.get('selectedSignal') === null) {
                      self.set('selectedSignal', simulationModel.get('mapping')[0]);
                    }
                  }
                });
              });
            });
          });
        });
      });
    }

    // update observer TODO: Only update when (query) changed
    let observeQuery = this.get('observeQuery');
    if (query !== observeQuery) {
      if (observeQuery != null) {
        this.removeObserver(observeQuery, this._updateData);
      }

      this.addObserver(query, this._updateData);
      this.set('observeQuery', query);
    }
  })),

  _updateData() {
    // get values from array
    let simulatorId = this.get('widget.widgetData.simulator');
    let values = this.get('data.' + simulatorId + '.flotValues');
    var updatedValues = Ember.A([]);

    // update plot options
    var plotOptions = this.get('plotOptions');

    // calculate diff for first and last timestamp
    var firstTimestamp = values[0][0][0];
    var lastTimestamp = values[0][values[0].length - 1][0];

    var diff = lastTimestamp - firstTimestamp;
    var diffValue = this.get('widget.widgetData.time') * 1000;  // javascript timestamps are in milliseconds

    if (diff > diffValue) {
      firstTimestamp = lastTimestamp - diffValue;
    } else {
      lastTimestamp = +firstTimestamp + +diffValue;
    }

    plotOptions.xaxis.min = firstTimestamp;
    plotOptions.xaxis.max = lastTimestamp;
    this.set('plotOptions', plotOptions);

    // update values
    var index = 0;

    this.get('signals').forEach(function(signal) {
      updatedValues.replace(index, 1, Ember.A([ values[signal] ]));
      index += 1;
    });

    this.set('plotData', updatedValues);
  },

  doubleClick() {
    if (this.get('editing') === true) {
      // prepare modal
      this.set('name', this.get('widget.name'));
      this.set('plotType', this.get('widget.widgetData.type'));
      this.set('time', this.get('widget.widgetData.time'));
      this.set('errorMessage', null);

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

                    // set signals
                    let mapping = simulationModel.get('mapping');
                    let checkedSignals = {};

                    // uncheck all signals
                    mapping.forEach(function(key) {
                      checkedSignals[key] = false;
                    });

                    self.get('signals').forEach(function(signal) {
                      checkedSignals[mapping[signal]] = true;
                    });

                    self.set('checkedSignals', checkedSignals);
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
                    let widgetData = {
                      type: self.get('plotType')
                    };

                    widgetData.simulator = simulator.get('simulatorid');
                    widgetData.time = self.get('time');

                    // set signals
                    let mapping = simulationModel.get('mapping');
                    widgetData.signals = [];

                    // uncheck all signals
                    let checkedSignals = self.get('checkedSignals');

                    for (var i = 0; i < mapping.length; i++) {
                      if (checkedSignals[mapping[i]]) {
                        widgetData.signals.push(i);
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

    selectType(type) {
      this.set('plotType', type);
    },

    selectTableSignal(signal) {
      // display signal
      let mapping = this.get('simulationModel.mapping');

      for (var i = 0; i < mapping.length; i++) {
        if (mapping[i] === signal) {
          this.set('widget.widgetData.signals', [ i ]);
        }
      }

      this.set('selectedSignal', signal);
    }
  }
});
