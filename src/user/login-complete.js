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
import LoginStore from './login-store'
import NotificationsDataManager from '../common/data-managers/notifications-data-manager';



class LoginComplete extends React.Component {
  constructor(props) {
    super(props);
    
    AppDispatcher.dispatch({
      type: 'users/extlogin',
    });

    this.state = {
      loginMessage: '',
      token: '',
      currentUser: '',
    }
  }

  static getStores(){
    return [LoginStore]
  }

  static calculateState(prevState, props) {
    // We need to work with the login store here to trigger the re-render upon state change after login
    // Upon successful login, the token and currentUser are stored in the local storage as strings
    return {
      loginMessage: LoginStore.getState().loginMessage,
      token: LoginStore.getState().token,
      currentUser: LoginStore.getState().currentUser,
    }
  }

  componentDidMount() {
    NotificationsDataManager.setSystem(this.refs.notificationSystem);
  }

  render() {
    const { user } = this.state.currentUser;
    if (this.state.currentUser !== null && this.state.currentUser !== "") {
      return (<Redirect to="/home" />);
    }
    else {
      return (<p>Authenticating..</p>);
    }
  }
}

export default LoginComplete;
