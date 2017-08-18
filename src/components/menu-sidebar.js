/**
 * File: menu-sidebar.js
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

import React from 'react';
import { NavLink } from 'react-router-dom';

class SidebarMenu extends React.Component {
  render() {
    return (
      <div className="menu-sidebar">
        <h2>Menu</h2>

        <ul>
          <li><NavLink to="/home" activeClassName="active" title="Home">Home</NavLink></li>
          <li><NavLink to="/projects" activeClassName="active" title="Projects">Projects</NavLink></li>
          <li><NavLink to="/simulations" activeClassName="active" title="Simulations">Simulations</NavLink></li>
          <li><NavLink to="/simulators" activeClassName="active" title="Simulators">Simulators</NavLink></li>
          { this.props.currentRole === 'admin' ? 
              <li><NavLink to="/users" activeClassName="active" title="User Management">User Management</NavLink></li> : ''
          }
          <li><NavLink to="/logout" title="Logout">Logout</NavLink></li>
        </ul>
      </div>
    );
  }
}

export default SidebarMenu;
