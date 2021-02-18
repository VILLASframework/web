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
import { Container } from 'flux/utils';

import AppDispatcher from '../common/app-dispatcher';
import LoginStore from './login-store'

class Logout extends React.Component {

  static getStores() {
    return [LoginStore]
  }

  static calculateState(prevState, props) {
    return {
      config: LoginStore.getState().config,
    }
  }

  componentDidMount() {
    this.resetValues();
  }

  resetValues() {
    AppDispatcher.dispatch({
      type: 'users/logout'
    });

    // The Login Store is deleted automatically

    // discard login token and current User
    localStorage.setItem('token', '');
    localStorage.setItem('currentUser', '');
  }

  render() {
    if (this.state.config) {
      let logout_url = _.get(this.props.config, ['authentication', 'logout_url'])
      if (logout_url) {
        this.resetValues();
        window.location = logout_url;
      }
    }
    return (
      <Redirect to="/login" />
    );
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Logout));