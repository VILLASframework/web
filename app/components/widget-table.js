/**
 * File: widget-table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 05.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import WidgetAbstract from './widget-abstract';

export default WidgetAbstract.extend({
  classNames: [ 'widgetTable' ],

  minWidth_resize: 200,
  minHeight_resize: 60,

  _updateDataObserver: Ember.on('init', Ember.observer('widget.simulator', 'widget.signal', function() {
    let query = 'data.' + this.get('widget.simulator') + '.sequence';
    this.addObserver(query, function() {
      // get values from array
    });
  }))
});
