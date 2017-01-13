/**
 * File: edit.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 05.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';
import FetchLiveDataMixin from '../../mixins/fetch-live-data';

export default Ember.Controller.extend(FetchLiveDataMixin, {
  isShowingWidgetValueModal: false,

  errorMessage: null,

  widget: null,
  name: null,
  simulator: null,
  simulatorName: null,
  signal: null,

  actions: {
    addWidget(name, position) {
      // get first simulator id
      let defaultSimulatorid = 0;

      this.get('model.project').then((project) => {
        project.get('simulation').then((simulation) => {
          simulation.get('models').then((simulationModels) => {
            simulationModels.toArray()[0].get('simulator').then((simulator) => {
              defaultSimulatorid = simulator.get('simulatorid');

              // create widget
              let widget = null;
              let properties = {
                x: position.x,
                y: position.y,
                name: 'widget',
                type: null
              };

              if (name === 'label') {
                properties.type = 'widget-label';
                properties.width = 100;
                properties.height = 20;
                properties.name = 'Label';
              } else if (name === 'table') {
                properties.type = 'widget-table';
                properties.name = "Table";
                properties.width = 500;
                proeprties.height = 200;
                properties.widgetData = { simulator: defaultSimulatorid };
              } else if (name === 'value') {
                properties.type = 'widget-value';
                properties.name = 'Value';
                properties.width = 250;
                properties.height = 20;
                properties.widgetData = { signal: 0, simulator: defaultSimulatorid };
              } else if (name === 'plot') {
                properties.type = 'widget-plot';
                properties.name = 'Plot';
                properties.width = 500;
                properties.height = 200;
                properties.widgetData = { signal: 0, simulator: defaultSimulatorid };
              } else {
                // DEBUG
                console.log('Add unknown widget ' + name);
                return;
              }

              if (properties.type != null) {
                // create widget
                widget = this.store.createRecord('widget', properties);

                // add widget to visualization
                this.get('model.widgets').pushObject(widget);

                // save new widget
                var visualization = this.get('model');

                widget.save().then(function() {
                  // save the widget in the visualization
                  visualization.get('widgets').pushObject(widget);
                  visualization.save();
                });
              } else {
                console.error('Unknown widget type: ' + name);
              }
            });
          });
        });
      });
    },

    saveEdit() {
      // save changes to store
      var widgets = this.get('model.widgets');
      widgets.forEach(function(widget) {
        widget.save();
      });

      // go back to index
      var id = this.get('model.id');
      this.transitionToRoute('/visualization/' + id);
    },

    cancelEdit() {
      // TODO: revert changes

      let id = this.get('model.id');
      this.transitionToRoute('/visualization/' + id);
    },

    showWidgetDialog(widget) {
      // show dialog by widget type
      let widgetType = widget.get('type');
      if (widgetType === 'value') {
        // set properties
        this.set('widget', widget);
        /*this.set('name', plot.get('name'));
        this.set('signal', plot.get('signal'));*/

        //this.set('simulatorName', simulatorName);

        this.set('isShowingWidgetValueModal', true);
      }
    }
  }
});
