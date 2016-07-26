/**
 * File: simulation-data.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  simulator: Ember.computed.alias('id'),
  sequence: attr('number'),
  values: attr('array'),

  historyValues() {
    return this._history;
  },

  _history: [],

  _updateHistory: function() {
    this._history.unshift(this.get('values'));
    while (this._history.length > 500) {
      this._history.shift();
    }
  }.observes('values')
});
