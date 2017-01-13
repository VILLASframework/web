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
  timestamp: attr('number'),
  values: attr('array'),

  flotValues: Ember.computed('_flotValues', function() {
    return this._flotValues;
  }),

  _flotValues: [],

  historyValues: Ember.computed('_history', function() {
    return this._history;
  }),

  _history: [],

  _updateHistories: Ember.observer('values', function() {
    // save set of values with timestamp
    this._flotValues.push([this.get('timestamp'), this.get('values')[0]]);

    // discard old values
    while (this._flotValues.length > 100) {
      this._flotValues.shift();
    }
  })
});
