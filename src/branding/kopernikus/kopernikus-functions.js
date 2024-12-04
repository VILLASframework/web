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
import React from "react";

export function kopernikus_home() {
  return (
    <div className="home-container">
      <h1>Home</h1>
      <p>
        Welcome to the <b>Kopernikus Projects - ENSURE</b>!
      </p>
      <p>
        Rethinking the energy system for Germany and finding answers to the
        questions of the energy transition: This is the great challenge that the
        Kopernikus projects are facing. Find out more about the four main
        pillars on these pages. The Kopernikus projects are making a significant
        contribution to ensuring that Germany can achieve its climate targets by
        2045.
      </p>

      <h3>Contacts</h3>
      <ul>
        <li>
          <a href="mailto:fwege@eonerc.rwth-aachen.de">Felix Wege</a>
        </li>
        <li>
          <a href="mailto:alexandra.bach@eonerc.rwth-aachen.de">
            Alexandra Bach
          </a>
        </li>
      </ul>

      <h3>Credits</h3>
      <div>
        <img
          id="images"
          height={70}
          src={require("./img/Logo_BMBF.jpg").default}
          alt="Logo BMBF"
        />
      </div>
    </div>
  );
}

export function kopernikus_welcome() {
  return (
    <div>
      <h1>Welcome!</h1>
      <p>
        SLEW is a learning platform for running experiments in a virtual power
        engineering world. The platform enables to interact with the experiments
        in real time and perform analyses on the experimental results.
      </p>
    </div>
  );
}
