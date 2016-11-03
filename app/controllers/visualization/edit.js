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
    addWidget(name) {
      let widget = null;

      if (name === 'label') {
        widget = this.store.createRecord('widget', { name: 'Label', type: 'widget-label', width: 100, height: 20 });
      } else if (name === 'table') {
        widget = this.store.createRecord('widget', { name: 'Table 1', type: 'widget-table', width: 500, height: 200, widgetData: { simulator: 2 } });
      } else if (name === 'value') {
        widget = this.store.createRecord('widget', { name: 'Value 1', type: 'widget-value', width: 250, height: 20, widgetData: { signal: 0, simulator: 2 } });
      } else {
        // DEBUG
        console.log('Add widget ' + name);
        return;
      }

      if (widget != null) {
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
