/**
 * File: home.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 *
 * This file is part of VILLASweb.
 *
 * VILLASweb is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * VILLASweb is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with VILLASweb. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

import React, { Component } from 'react';
import { Container } from 'flux/utils';

// import AppDispatcher from '../app-dispatcher';
import VillasStore from '../stores/villas-store';

class Home extends Component {
  static getStores() {
    return [ VillasStore ];
  }

  static calculateState() {
    return {
      villas: VillasStore.getState()
    };
  }

  render() {
    return (
      <h1>Home</h1>
    );
  }
}

export default Container.create(Home);
