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
import { Redirect } from 'react-router-dom';

import AppDispatcher from '../common/app-dispatcher';
import Config from '../config.js';

class Logout extends React.Component {
  componentDidMount() {
    AppDispatcher.dispatch({
      type: 'users/logout'
    });

    // The Login Store is deleted automatically

    // discard login token and current User
    localStorage.setItem('token', '');
    localStorage.setItem('currentUser', '');
  }

  render() {
    if (Config.externalAuth) {
      return (
        <Redirect to="/login" />
      );
    } else {
      return (
        <Redirect to="/villaslogin" />
      );
    }
  }
}

export default Logout;
