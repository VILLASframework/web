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


export function enershare_home() {
  return (
    <div className="home-container">
      <img style={{ height: 50, float: 'right' }} src={require('./img/logo_Enershare.svg').default} alt="EnerShare Logo" />
      <h1>Home</h1>
      <p>
        Welcome to <b>DT-FPEN</b>!
      </p>
      <p>The DT concept for electrical networks is based on the simulation tool DPSim, and allows the interconnection
        to data acquisition devices (measurement devices and status indicators) and the interaction with other systems.</p>

      <p>It is possibile to interconnect with other systems, like the service for Data-driven management of surplus RES generation 
        where forecasts for the consumers in low voltage are calculated, or that can be used for predicting the consumption 
        of the water pumps in the circuit of the pilot. This will allow the pilot to improve their usage of the flexibility capabilities.</p>
    </div>)
}

export function enershare_welcome() {
  return (
    <div >
      <h1>Welcome!</h1>
      <p>This is the Digital Twin for flexible energy networks, a system designed to facilitate the integration and flexibility on electrical networks with renewable energy sources.</p>
    </div>)
}

export function enershare_footer() {
  return (
    <footer className="app-footer">
      The development of this Digital Twin received funding from
      <p className="funding-logos">
        <img src={require('./img/logo_Enershare.svg').default} width="100vw" alt="Logo EnerShare" />
      </p>
      <a href="https://enershare.eu/">Enershare</a>, an European Union’s Horizon Europe Research and Innovation programme under the Grant Agreement No 101069831.
      
      <p>Copyright &copy; {new Date().getFullYear()} - <a href="https://www.acs.eonerc.rwth-aachen.de">Institute for Automation of Complex Power Systems</a> - <a href="https://www.rwth-aachen.de">RWTH Aachen University</a> </p>
    </footer>
  );
}
