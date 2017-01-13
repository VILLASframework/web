/**
 * File: draggable-dropzone.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

var { set } = Ember;

export default Ember.Component.extend({
  tagName: 'div',
  classNames: [ 'draggableDropzone' ],
  classNameBindings: [ 'dragClass' ],
  dragClass: 'deactivated',

  dragLeave(event) {
    event.preventDefault();
    set(this, 'dragClass', 'deactivated');
  },

  dragOver(event) {
    event.preventDefault();
    set(this, 'dragClass', 'activated');
  },

  drop(event) {
    var data = event.dataTransfer.getData('text/data');
    var position = {
      x: event.originalEvent.pageX - $(event.target).offset().left - parseFloat(event.dataTransfer.getData('offset/x')),
      y: event.originalEvent.pageY - $(event.target).offset().top - parseFloat(event.dataTransfer.getData('offset/y'))
    }

    this.sendAction('dropped', data, position);

    set(this, 'dragClass', 'deactivated');
  }
});
