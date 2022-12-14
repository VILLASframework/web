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
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';


export function villasweb_welcome() {
  let url = 'https://villas.fein-aachen.org/doc/web.html';
  return (
      <div >
          <h1>Welcome!</h1>
          <p>VILLASweb is a tool to configure real-time co-simulations and display simulation real-time data.
              It enables the management and monitoring of simulators, models and simulations.</p>
          <span className='solid-button'>
            <Button key="learnmore" onClick={e => window.location = url }>Learn more</Button>
          </span>
      </div>)
}

export function villasweb_home(title, username, userid, role) {
  return (
    <div className="home-container">
      <img style={{ height: 120, float: 'right' }} src={require('./img/villas_web.svg').default} alt="Logo VILLASweb" />
      <h1>Home</h1>
      <p>
        Welcome to <b>{title}</b>!
      </p>
      <p>
        You are logged in as user <b>{username}</b> with <b>ID {userid}</b> and role <b>{role}</b>.
      </p>
      <h3>Credits</h3>
      <p>VILLASweb is an open source project developed by the <a href="http://acs.eonerc.rwth-aachen.de">Institute for Automation of Complex Power Systems</a> at <a href="https;//www.rwth-aachen.de">RWTH Aachen University</a>.</p>
      <img height={60} src={require('./img/eonerc_rwth.svg').default} alt="Logo ACS" />
      <ul>
        <li><a href="mailto:ikoester@eonerc.rwth-aachen.de">Iris Köster</a></li>
        <li><a href="mailto:stvogel@eonerc.rwth-aachen.de">Steffen Vogel</a></li>
      </ul>
      <h3>Links</h3>
      <ul>
        <li><NavLink to="/api">VILLASweb API browser</NavLink></li>
        <li><a href="http://fein-aachen.org/projects/villas-framework/">FEIN Aachen e.V. project page of VILLASframework</a></li>
        <li><a href="https://villas.fein-aachen.org/docs/web">Documentation of VILLASweb</a></li>
        <li><a href="https://git.rwth-aachen.de/acs/public/villas/web">Source Code of VILLASweb frontend</a></li>
        <li><a href="https://git.rwth-aachen.de/acs/public/villas/web-backend-go">Source Code of VILLASweb backend</a></li>
      </ul>
      <h3>Funding</h3>
      <p>The development of <a href="http://fein-aachen.org/projects/villas-framework/">VILLASframework</a> projects has received funding from</p>
      <ul>
        <li><a href="https://www.acs.eonerc.rwth-aachen.de/cms/E-ON-ERC-ACS/Forschung/Forschungsprojekte/Bildungsprojekte/~mikmu/SLEW-SECOND-LIFE-FOR-ENERGIEWENDE/">SLEW:</a> Second Life for Energiewende, an Exploratory Teaching Space project funded by RWTH Aachen University</li>
        <li><a href="https://erigrid2.eu/">ERIgrid 2.0:</a> An EU Horizon 2020 research and innovation action project for connecting European Smart Grid Infrastructures (grant agreement No 870620)</li>
        <li><a href="http://www.uel4-0.de/">Urban Energy Lab 4.0:</a> A project funded by EFRE.NRW (European Regional Development Fund) for the setup of a novel energy research infrastructure.</li>
        <li><a href="http://www.re-serve.eu">RESERVE:</a> An EU Horizon 2020 research and innovation project (grant agreement No 727481)</li>
        <li><a href="http://www.jara.org/en/research/energy">JARA-ENERGY:</a> Jülich-Aachen Research Alliance (JARA) is an initiative of RWTH Aachen University and Forschungszentrum Jülich.</li>
      </ul>
      <p className="funding-logos">
        <img src={require('./img/uel_efre.jpeg').default} alt="Logo UEL OP EFRE NRW" />
        <img src={require('./img/uel.png').default} alt="Logo UEL" />
        <img src={require('./img/european_commission.svg').default} alt="Logo EU" />
        <img src={require('./img/reserve.svg').default} alt="Logo RESERVE" />
        <img src={require('./img/european_commission.svg').default} alt="Logo EU" />
        <img src={require('./img/erigrid2.png').default} alt="Logo ERIgrid 2.0" />
      </p>
    </div>)
}

export function villasweb_footer() {
  return (
    <footer className="app-footer">
      Copyright &copy; {new Date().getFullYear()} - <a href="https://www.acs.eonerc.rwth-aachen.de">Institute for Automation of Complex Power Systems</a> - <a href="https://www.rwth-aachen.de">RWTH Aachen University</a>
    </footer>
  );
}
