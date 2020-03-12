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

export default class HeaderMenu extends React.Component {
  render() {
    return <div>

      <Button className="closeButton" variant="link" onClick={this.props.onClose}>&times;</Button>

      <ul>
        <li><NavLink to="/home" activeClassName="active" title="Home" onClick={this.props.onClose}>Home</NavLink></li>
        <li><NavLink to="/scenario" activeClassName="active" title="Scenarios" onClick={this.props.onClose}>Scenarios</NavLink></li>
        <li><NavLink to="/infrastructure" activeClassName="active" title="Infrastructure Components" onClick={this.props.onClose}>Infrastructure Components</NavLink></li>
        { this.props.currentRole === 'Admin' ?
            <li><NavLink to="/users" activeClassName="active" title="User Management" onClick={this.props.onClose}>User Management</NavLink></li> : ''
        }
        <li><NavLink to="/logout" title="Logout" onClick={this.props.onClose}>Logout</NavLink></li>
      </ul>
    </div>;
  }
}
