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

export function opalrt_welcome() {
  let url = 'https://villas.fein-aachen.org/doc/web.html';
  return (
    <div >
      <h1>Welcome!</h1>
      <p>VILLASweb is a tool to configure real-time co-simulations and display simulation real-time data.
        It enables the management and monitoring of simulators, models and simulations.</p>
      <span className='solid-button'>
        <Button key="learnmore" onClick={e => window.location = url}>Learn more</Button>
      </span>
    </div>)
}

export function opalrt_home(title, username, userid, role) {
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
        <li><a href="mailto:steffen.vogel@opal-rt.com">Steffen Vogel</a></li>
        <li><a href="mailto:ikoester@eonerc.rwth-aachen.de">Iris Köster</a></li>
      </ul>
      <h3>Links</h3>
      <ul>
        <li><NavLink to="/api">VILLASweb API browser</NavLink></li>
        <li><a href="http://fein-aachen.org/projects/villas-framework/">FEIN Aachen e.V. project page of VILLASframework</a></li>
        <li><a href="https://villas.fein-aachen.org/docs/web">Documentation of VILLASweb</a></li>
        <li><a href="https://git.rwth-aachen.de/acs/public/villas/web">Source Code of VILLASweb frontend</a></li>
        <li><a href="https://git.rwth-aachen.de/acs/public/villas/web-backend-go">Source Code of VILLASweb backend</a></li>
      </ul>
    </div>)
}

export function opalrt_footer() {
  return (
    <footer className="app-footer">
      Copyright &copy; {new Date().getFullYear()} - <a href="https://www.acs.eonerc.rwth-aachen.de">Institute for Automation of Complex Power Systems</a> - <a href="https://www.rwth-aachen.de">RWTH Aachen University</a>
    </footer>
  );
}
