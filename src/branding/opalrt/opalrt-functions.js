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
      <h1>Home</h1>
      <p>
        Welcome to <b>{title}</b>!
      </p>
      <p>
        You are logged in as user <b>{username}</b> with <b>ID {userid}</b> and role <b>{role}</b>.
      </p>
      <h3>Contacts</h3>
      <ul>
        <li><a href="mailto:steffen.vogel@opal-rt.com">Steffen Vogel</a> (OPAL-RT)</li>
        <li><a href="mailto:ikoester@eonerc.rwth-aachen.de">Iris Köster</a> (RWTH)</li>
      </ul>
      <h3>Links</h3>
      <ul>
        <li><a href="https://opal-rt.com/">OPAL-RT Technologies</a></li>
        <li><NavLink to="/api">API browser</NavLink></li>
        <li><a href="https://fein-aachen.org/projects/villas-framework/">Project page of VILLASframework</a></li>
        <li><a href="https://villas.fein-aachen.org/docs/web">Documentation</a></li>
        <li>Source Code of <a href="https://github.com/VILLASframework/web">frontend</a> &amp; <a href="https://github.com/VILLASframework/web-backend">backend</a></li>
      </ul>
      <h3>Credits</h3>
      <p>
        VILLASweb is an open source project developed by the <a href="http://acs.eonerc.rwth-aachen.de">Institute for Automation of Complex Power Systems</a> at <a href="https;//www.rwth-aachen.de">RWTH Aachen University</a>.<br />
        This instance is operated by OPAL-RT Technologies Inc.
      </p>
      <p>
        <a href="https://opal-rt.com/"><img height={60} src={require('./img/logo_opalrt.svg').default} alt="Logo OPAL-RT" style={{marginRight: 15}}  /></a>
        <a href="https://www.acs.rwth-aachen.de"><img height={60} src={require('./img/eonerc_rwth.svg').default} alt="Logo ACS" /></a>
      </p>
    </div>)
}

export function opalrt_footer() {
  return (
    <footer className="app-footer">
      Copyright &copy; {new Date().getFullYear()} - <a href="https://opal-rt.com/">OPAL-RT Technologies</a> - <a href="https://www.acs.rwth-aachen.de">RWTH Aachen University</a>
    </footer>
  );
}
