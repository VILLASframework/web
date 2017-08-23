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
import UserStore from '../stores/users-store';

class Home extends Component {
  static getStores() {
    return [ VillasStore ];
  }

  static calculateState() {
    return {
      villas: VillasStore.getState(),
      currentUser: UserStore.getState().currentUser
      counts: {
        users: UserStore.getState().users.length
    };
  }

  render() {
    return (
      <h1>Home</h1>
      <p>Welcome {this.state.currentUser}! This is the VILLASweb frontend version [version] hosted by [admin].</p>
      <p>This instance is hosting {this.state.counts.projects} projects consisting of {this.state.counts.nodes} nodes, {this.state.counts.simulations} simulations and {this.state.counts.visualizations} visualisations.<p>
      <p>There are currently {this.state.counts.users} users registered.</p>
      <h3>Credits</h3>
      <p>VILLASweb is developed by the Institute for Automation of Complex Power Systems at the RWTH Aachen University.</p>
      <ul>
        <li><a href="mailto:mgrigull@eonerc.rwth-aachen.de">Markus Grigull</a></li>
        <li><a href="mailto:stvogel@eonerc.rwth-aachen.de">Steffen Vogel</a></li>
        <li><a href="mailto:mstevic@eonerc.rwth-aachen.de">Marija Stevic</a></li>
      </ul>
      <img src="" alt="Logo ACS" />
      <h3>Links</h3>
      <ul>
        <li><a href="http://fein-aachen.org/projects/villas-framework/">Project Page</a></li>
        <li><a href="https://villas.fein-aachen.org/doc/web.html">Dokumentation</a></li>
        <li><a href="https://git.rwth-aachen.de/VILLASframework/VILLASweb">Source Code</a></li>
      </ul>
      <h3>Funding</h3>
      <p>The development of <a href="http://fein-aachen.org/projects/villas-framework/">VILLASframework</a> projects have received funding from</p>
      <ul>
        <li><a href="http://www.re-serve.eu">RESERVE</a> a European Union’s Horizon 2020 research and innovation programme under grant agreement No 727481</li>
        <li><a href="http://www.jara.org/en/research/energy">JARA-ENERGY</a>. Jülich-Aachen Research Alliance (JARA) is an initiative of RWTH Aachen University and Forschungszentrum Jülich.</p>
      </ul>
      <img src="" alt="Logo EU" />
      <img src="" alt="Logo JARA" />
    );
  }
}

export default Container.create(Home);
