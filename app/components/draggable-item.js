/**
 * File: draggable-item.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

var { get } = Ember;

export default Ember.Component.extend({
  classNames: [ 'draggableItem' ],
  attributeBindings: [ 'draggable' ],
  draggable: 'true',

  dragStart(event) {
    event.dataTransfer.setData('offset/x', event.originalEvent.pageX - Ember.$(event.target).offset().left);
    event.dataTransfer.setData('offset/y', event.originalEvent.pageY - Ember.$(event.target).offset().top);

    return event.dataTransfer.setData('text/data', get(this, 'content'));
  }
});
