/**
 * File: file.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 25.01.2017
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  path: DS.attr('string'),
  type: DS.attr('string'),
  user: DS.belongsTo('user', { async: true }),
  date: DS.attr('date')
});
