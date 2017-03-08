/**
 * File: project-store.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 07.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import ArrayStore from './array-store';
import ProjectsDataManager from '../data-managers/projects-data-manager';

export default new ArrayStore('projects', ProjectsDataManager);
