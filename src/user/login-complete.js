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


class LoginComplete extends React.Component {
  constructor(props) {
    console.log("LoginComplete constructor");
    super(props);
    
    AppDispatcher.dispatch({
      type: 'users/extlogin',
    });

    this.state = {
      loginMessage: '',
      token: '',
      currentUser: '',
      secondsToWait: 99,
    }

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.stopTimer = this.stopTimer.bind(this);

    
  }

  componentDidMount() {
    this.startTimer();
    this.setState({secondsToWait: 5});
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

  stopTimer() {
    console.log("stop timer");
    clearInterval(this.timer);
  }

  startTimer() {
    if (this.timer == 0 && this.state.secondsToWait > 0) {
      // call function 'countDown' every 1000ms
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    let seconds = this.state.secondsToWait - 1;
    this.setState({secondsToWait: seconds});

    // waiting time over, stop counting down
    if (seconds == 0) {
      clearInterval(this.timer);
    }
  }

  render() {
    if (this.state.currentUser && this.state.currentUser !== "") {
      this.stopTimer();
      return (<Redirect to="/home" />);
    }
    else if (this.state.secondsToWait == 0) {
      this.stopTimer();
      return (<Redirect to="/login" />);
    } else {
      return (<div class="verticalhorizontal">
        <img style={{height: 300}}src={require('../img/dog-waiting-bw.jpg').default} alt="Waiting Dog" /></div>);
    }
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(LoginComplete));