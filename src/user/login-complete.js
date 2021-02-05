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
import { Container } from 'flux/utils';

import NotificationsDataManager from '../common/data-managers/notifications-data-manager';
import NotificationsFactory from "../common/data-managers/notifications-factory";



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
      secondsToWait: 5,
    }

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);

    this.startTimer();
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

  componentDidUnmount() {
    console.log("component unmounting");
    //clearInterval(this.timer);
  }

  startTimer() {
    if (this.timer == 0 && this.state.secondsToWait > 0) {
      // call function 'countDown' every 1000ms
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    console.log("count down, seconds:");
    let seconds = this.state.secondsToWait - 1;
    console.log(seconds);
    this.setState({secondsToWait: seconds});

    // waiting time over, stop counting down
    if (seconds == 0) {
      clearInterval(this.timer);
    }
  }

  render() {
    console.log("render, seconds to wait:");
    console.log(this.state.secondsToWait);
    if (this.state.currentUser !== null && this.state.currentUser !== "") {
      return (<Redirect to="/home" />);
    }
    else if (this.state.secondsToWait > 0) {
      return (<p>Authenticating.. {this.state.secondsToWait}</p>);
    } else { // authenticating failed
      //NotificationsFactory.LOAD_ERROR('Backend did not return user after external auth');
      return (<Redirect to="/login" />);
    }
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(LoginComplete));