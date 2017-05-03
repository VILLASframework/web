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

import React, { Component } from 'react';
import { Link } from 'react-router';

class SidebarMenu extends Component {
  render() {
    return (
      <div className="menu-sidebar">
        <h2>Menu</h2>

        <ul>
          <li><Link to="/home" activeClassName="active">Home</Link></li>
          <li><Link to="/projects" activeClassName="active">Projects</Link></li>
          <li><Link to="/simulations" activeClassName="active">Simulations</Link></li>
          <li><Link to="/simulators" activeClassName="active">Simulators</Link></li>
          { this.props.currentRole === 'admin' ? 
              <li><Link to="/users" activeClassName="active">User Management</Link></li> : ''
          }
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </div>
    );
  }
}

export default SidebarMenu;
