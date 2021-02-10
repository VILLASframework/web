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
import { NavLink } from 'react-router-dom';

class SidebarMenu extends React.Component {
  render() {
    return (
      <div className="menu-sidebar">
        <h2>Menu</h2>

        <ul>
          <li><NavLink to="/home" activeClassName="active" title="Home">Home</NavLink></li>
          <li><NavLink to="/scenarios" activeClassName="active" title="Scenarios">Scenarios</NavLink></li>
          <li><NavLink to="/infrastructure" activeClassName="active" title="Infrastructure Components">Infrastructure Components</NavLink></li>
          { this.props.currentRole === 'Admin' ?
              <li><NavLink to="/users" activeClassName="active" title="User Management">User Management</NavLink></li> : ''
          }
          <li><NavLink to="/account" title="Account">Account</NavLink></li>
          <li><NavLink to="/logout" title="Logout">Logout</NavLink></li>
          <li><NavLink to="/api" title="API Browser">API Browser</NavLink></li>
        </ul>
      </div>
    );
  }
}

export default SidebarMenu;
