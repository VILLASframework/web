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

import AppDispatcher from '../app-dispatcher';

import NodeStore from '../stores/node-store';
import SimulationStore from '../stores/simulation-store';
import ProjectStore from '../stores/project-store';

import config from '../config';

class Home extends Component {
  static getStores() {
    return [ NodeStore, SimulationStore, ProjectStore ];
  }

  static calculateState() {
    return {
      nodes: NodeStore.getState(),
      projects: ProjectStore.getState(),
      simulations: SimulationStore.getState(),
    };
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'projects/start-load',
      token: this.state.sessionToken
    });

    AppDispatcher.dispatch({
      type: 'simulations/start-load',
      token: this.state.sessionToken
    });
  }

  render() {
    return (
      <div className="home-container">
        <img style={{height: 120, float: 'right'}} src={require('../img/villas_web.svg')} alt="Logo VILLASweb" />
        <h1>Home</h1>
        <p>
          Welcome to <b>{config.instance}</b>!<br />
          VILLASweb is a frontend for distributed real-time simulation hosted by <a href={"mailto:" + config.admin.mail}>{config.admin.name}</a>.
        </p>
        <p>
          This instance is hosting {this.state.projects.length} projects consisting of {this.state.nodes.length} nodes and {this.state.simulations.length} simulations.<br />
        </p>
        <h3>Credits</h3>
        <p>VILLASweb is developed by the <a href="http://acs.eonerc.rwth-aachen.de">Institute for Automation of Complex Power Systems</a> at the <a href="https;//www.rwth-aachen.de">RWTH Aachen University</a>.</p>
        <ul>
          <li><a href="mailto:mgrigull@eonerc.rwth-aachen.de">Markus Grigull</a></li>
          <li><a href="mailto:stvogel@eonerc.rwth-aachen.de">Steffen Vogel</a></li>
          <li><a href="mailto:mstevic@eonerc.rwth-aachen.de">Marija Stevic</a></li>
        </ul>
        <h3>Links</h3>
        <ul>
          <li><a href="http://fein-aachen.org/projects/villas-framework/">Project Page</a></li>
          <li><a href="https://villas.fein-aachen.org/doc/web.html">Documentation</a></li>
          <li><a href="https://git.rwth-aachen.de/VILLASframework/VILLASweb">Source Code</a></li>
        </ul>
        <h3>Funding</h3>
        <p>The development of <a href="http://fein-aachen.org/projects/villas-framework/">VILLASframework</a> projects have received funding from</p>
        <ul>
          <li><a href="http://www.re-serve.eu">RESERVE</a> a European Union’s Horizon 2020 research and innovation programme under grant agreement No 727481</li>
          <li><a href="http://www.jara.org/en/research/energy">JARA-ENERGY</a>. Jülich-Aachen Research Alliance (JARA) is an initiative of RWTH Aachen University and Forschungszentrum Jülich.</li>
        </ul>
        <img height={60} src={require('../img/eonerc_rwth.svg')} alt="Logo ACS" />
        <img height={70} src={require('../img/jara.svg')} alt="Logo JARA" />
        <img height={100} src={require('../img/european_commission.svg')} alt="Logo EU" />
      </div>
    );
  }
}

export default Container.create(Home);
