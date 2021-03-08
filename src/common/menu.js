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
import { Container } from 'flux/utils';
import LoginStore from '../user/login-store';
import AppDispatcher from './app-dispatcher';


class SidebarMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      externalAuth: false,
      logoutLink: "",
    }
  }

  static getStores() {
    return [LoginStore]
  }

  static calculateState(prevState, props) {
    let config = LoginStore.getState().config;
    let logout_url = _.get(config, ['authentication', 'logout_url']);

    if (logout_url) {
      return {
        externalAuth: true,
        logoutLink: logout_url,
      }
    }

    return {
      externalAuth: false,
      logoutLink: "/logout",
    }
  }

  logout() {
    AppDispatcher.dispatch({
      type: 'users/logout'
    });
    // The Login Store is deleted automatically

    // discard login token and current User
    localStorage.setItem('token', '');
    localStorage.setItem('currentUser', '');
  }

  render() {
    return (
      <div className="menu">
        <h2>Menu</h2>

        {this.state.externalAuth ?
          <ul>
            <li><NavLink to="/home" activeClassName="active" title="Home">Home</NavLink></li>
            <li><NavLink to="/scenarios" activeClassName="active" title="Scenarios">Scenarios</NavLink></li>
            <li><NavLink to="/infrastructure" activeClassName="active" title="Infrastructure">Infrastructure</NavLink></li>
            { this.props.currentRole === 'Admin' ?
                <li><NavLink to="/users" activeClassName="active" title="Users">Users</NavLink></li> : ''
            }
            <li><NavLink to="/account" title="Account">Account</NavLink></li>
            <a onClick={this.logout.bind(this)} href={this.state.logoutLink}>Logout</a>
            <li><NavLink to="/api" title="API Browser">API Browser</NavLink></li>
          </ul>
          : <ul>
          <li><NavLink to="/home" activeClassName="active" title="Home">Home</NavLink></li>
          <li><NavLink to="/scenarios" activeClassName="active" title="Scenarios">Scenarios</NavLink></li>
          <li><NavLink to="/infrastructure" activeClassName="active" title="Infrastructure">Infrastructure</NavLink></li>
          { this.props.currentRole === 'Admin' ?
              <li><NavLink to="/users" activeClassName="active" title="Users">Users</NavLink></li> : ''
          }
          <li><NavLink to="/account" title="Account">Account</NavLink></li>
          <li><NavLink to={this.state.logoutLink} title="Logout">Logout</NavLink></li>
          <li><NavLink to="/api" title="API Browser">API Browser</NavLink></li>
        </ul>}
      </div>
    );
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(SidebarMenu));
