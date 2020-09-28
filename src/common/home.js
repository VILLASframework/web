/**
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

import React from 'react';

import config from '../config';
import LoginStore from "../user/login-store";
import {Redirect} from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props);



    // create url for API documentation, distinguish between localhost and production deployment
    let docs_url = "";
    let docs_location = "/swagger/index.html";
    let base_url = window.location.origin;
    if (base_url.search("localhost") === -1){
      docs_url = base_url + docs_location;
    } else {
      // useful for local testing, replace port 3000 with port 4000 (port of backend)
      docs_url = base_url.replace("3000", "4000") + docs_location;
    }

    this.state = {
      currentUser: LoginStore.getState().currentUser,
      token: LoginStore.getState().token,
      docs_url: docs_url
    };

  }

  getCounts(type) {
    if (this.state.hasOwnProperty('counts'))
      return this.state.counts[type];
    else
      return '?';
  }

  render() {

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser == null){
      console.log("HOME redirecting to logout/ login")
      return (<Redirect to="/logout" />);
    }

    return (
      <div className="home-container">
        <img style={{height: 120, float: 'right'}} src={require('../img/villas_web.svg')} alt="Logo VILLASweb" />
        <h1>Home</h1>
        <p>
          Welcome to <b>{config.instance}</b> hosted by  <a href={"mailto:" + config.admin.mail}>{config.admin.name}</a>!<br />
        </p>
        <p>
        You are logged in as user <b>{currentUser.username}</b> with <b>ID {currentUser.id}</b> and role <b>{currentUser.role}</b>.
        </p>

        <p>
          An interactive documentation of the VILLASweb API is available <a href={this.state.docs_url} target="_blank" rel="noopener noreferrer">here</a>.
        </p>


        <h3>Data Model</h3>
        <img height={400} src={require('../img/datamodel.png')} alt="Datamodel VILLASweb" />

        <h3>Terminology </h3>

        <h5>Infrastructure Component</h5>
          <ul>
            <li>A component of research infrastructure</li>
            <li>Category: for example simulator, gateway, amplifier, database, etc.</li>
            <li>Type: for example RTDS, OpalRT, VILLASnode, Cassandra</li>
          </ul>

        <h5>Component Configuration</h5>
          <ul>
            <li>Input signals: Signals that can be modified in VILLASweb</li>
            <li>Output signals: Signals that can be visualized on dashboards of VILLASweb</li>
            <li>Parameters: Further configuration parameters of the infrastructure component</li>
          </ul>

        <h5>Dashboard</h5>
          <ul>
            <li>Visualize ongoing experiments in real-time</li>
            <li>Interact with ongoing experiments in real-time</li>
          </ul>

        <h5>Scenario</h5>
          <ul>
            <li>A collection of component configurations and dashboards for a specific experiment</li>
            <li>Users can have access to multiple scenarios</li>
          </ul>



        <h3>Credits</h3>
        <p>VILLASweb is developed by the <a href="http://acs.eonerc.rwth-aachen.de">Institute for Automation of Complex Power Systems</a> at the <a href="https;//www.rwth-aachen.de">RWTH Aachen University</a>.</p>
        <ul>
          <li><a href="mailto:stvogel@eonerc.rwth-aachen.de">Steffen Vogel</a></li>
          <li><a href="mailto:sonja.happ@eonerc.rwth-aachen.de">Sonja Happ</a></li>
        </ul>
        <h3>Links</h3>
        <ul>
          <li><a href="http://fein-aachen.org/projects/villas-framework/">Project Page</a></li>
          <li><a href="https://villas.fein-aachen.org/doc/web.html">Documentation</a></li>
          <li><a href="https://git.rwth-aachen.de/acs/public/villas/web">Source Code</a></li>
        </ul>
        <h3>Funding</h3>
        <p>The development of <a href="http://fein-aachen.org/projects/villas-framework/">VILLASframework</a> projects have received funding from</p>
        <ul>
          <li><a href="http://www.acs.eonerc.rwth-aachen.de/cms/E-ON-ERC-ACS/Forschung/Forschungsprojekte/Gruppe-Real-Time-Simulation-and-Hardware/~qxvw/Urban-Energy-Lab-4/">Urban Energy Lab 4.0</a> a project funded by OP EFRE NRW (European Regional Development Fund) for the setup of a novel energy research infrastructure.</li>
          <li><a href="http://www.re-serve.eu">RESERVE</a> a European Union’s Horizon 2020 research and innovation programme under grant agreement No 727481</li>
          <li><a href="http://www.jara.org/en/research/energy">JARA-ENERGY</a>. Jülich-Aachen Research Alliance (JARA) is an initiative of RWTH Aachen University and Forschungszentrum Jülich.</li>
        </ul>
        <img height={100} src={require('../img/european_commission.svg')} alt="Logo EU" />
        <img height={70} src={require('../img/reserve.svg')} alt="Logo EU" />
        <img height={70} src={require('../img/uel_efre.jpeg')} alt="Logo UEL OP EFRE NRW" />
        <img height={70} src={require('../img/uel.png')} alt="Logo UEL" />
        <img height={60} src={require('../img/eonerc_rwth.svg')} alt="Logo ACS" />
        {
          //<img height={70} src={require('../img/jara.svg')} alt="Logo JARA" />
        }
      </div>
    );
  }
}

export default Home;
