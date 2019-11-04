/**
 * File: logout.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.03.2017
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
import { Redirect } from 'react-router-dom';

import AppDispatcher from '../app-dispatcher';

class Logout extends React.Component {
  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'users/logout'
    });

    // discard login token
    localStorage.setItem('token', '');
  }

  render() {
    return (
      <Redirect to="/login" />
    );
  }
}

export default Logout;
