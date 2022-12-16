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
import './slew.css'


export function slew_home() {
    return (
        <div className="home-container">
            <h1>Home</h1>
            <p>
                Welcome to <b>SLEW</b>!
            </p>
            <p>SLEW is a learning platform for running experiments in a virtual power engineering world.
                The platform enables interaction with the experiments in real time and performing analysis on the experimental results.</p>

            <p>The motivation behind SLEW is the ongoing transformation of the energy system, which is making the system more and more complex.
            Hence, understanding new phenomena and underlying interactions is getting more challenging, also because real experimental
            activities for obtaining a better understanding are not possible for obvious reasons of security and safety.</p>

            <p>The SLEW platform gives the possibility to perform experiments in a virtual infrastructure and to learn from the execution
            of complex models. It provides a virtual power engineering world where complex phenomena take place while users can interact
                    with the system in real time.</p>

            <p>The platform is based on the real-time simulation tool DPsim developed in RWTH,
            which is available as open-source software project to the power engineering community. Besides, it integrates the interactive
                    computing environment Jupyter for further analysis of experimental results.</p>

            <h3>Contacts</h3>
            <ul>
              <li><a href="mailto:jdinkelbach@eonerc.rwth-aachen.de">Jan Dinkelbach</a></li>
              <li><a href="mailto:ikoester@eonerc.rwth-aachen.de">Iris Köster</a></li>
              <li><a href="mailto:post@steffenvogel.de">Steffen Vogel</a></li>
            </ul>

            <h3>Credits</h3>
              <div>
                <img id="images" height={70} src={require('./img/eonerc_rwth.svg').default} alt="Logo EONERC"/>
                <img id="images" height={70} src={require('./img/erigrid2.png').default} alt="Logo Erigrid"/>
                <img id="images" height={70} src={require('./img/european_commission.svg').default} alt="Logo EU"/>
              </div>
        </div>)
}

export function slew_welcome() {
  return (
      <div >
          <h1>Welcome!</h1>
          <p>SLEW is a learning platform for running experiments in a virtual power engineering world.
              The platform enables to interact with the experiments in real time and perform analyses on the experimental results.</p>
      </div>)
}
