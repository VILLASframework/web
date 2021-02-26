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
import Branding from '../branding/branding';


class SidebarMenu extends React.Component {
  render() {
    const brand = Branding.instance.brand;
    console.log(brand.links)
    let links = []

    /*++++
    for (var key of Object.keys(brand.links) ) {
      console.log(`${key}: ${brand.links[key]}`);
      links.push(<li><a href={brand.links[key]} title={key}>{key}</a></li>);
    }*/

    if (brand.links) {
      Object.keys(brand.links).forEach(key => {
        console.log(`${key}: ${brand.links[key]}`);
        links.push(<li><a href={brand.links[key]} title={key}>{key}</a></li>);
      })
    }


    return (
      <div className="menu-sidebar">
        <h2>Menu</h2>

        <ul>
          <li hidden={!brand.pages.home}><NavLink to="/home" activeClassName="active" title="Home">Home</NavLink></li>
          <li hidden={!brand.pages.scenarios}><NavLink to="/scenarios" activeClassName="active" title="Scenarios">Scenarios</NavLink></li>
          <li hidden={!brand.pages.infrastructure}><NavLink to="/infrastructure" activeClassName="active" title="Infrastructure Components">Infrastructure Components</NavLink></li>
          {this.props.currentRole === 'Admin' ?
            <li><NavLink to="/users" activeClassName="active" title="User Management">User Management</NavLink></li> : ''
          }
          <li hidden={!brand.pages.account}><NavLink to="/account" title="Account">Account</NavLink></li>
          <li><NavLink to="/logout" title="Logout">Logout</NavLink></li>
          <li hidden={!brand.pages.api}><NavLink to="/api" title="API Browser">API Browser</NavLink></li>
        </ul>
        {
          links.length > 0 ?
            <div>
              <br></br>
              <h4> Links</h4>
              <ul> {links} </ul>
            </div>
            : ''
        }
      </div>
    );
  }
}

export default SidebarMenu;
