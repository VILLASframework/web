/**
 * File: plot-value.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import PlotAbstract from './plot-abstract';

export default PlotAbstract.extend({
  classNames: [ 'plotValue' ],

  minWidth_resize: 50,
  minHeight_resize: 20
});
