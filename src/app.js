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
import { DndProvider } from 'react-dnd';
import { HTML5Backend }from 'react-dnd-html5-backend';
import NotificationSystem from 'react-notification-system';
import { Redirect, Route } from 'react-router-dom';
import jwt from 'jsonwebtoken'

import AppDispatcher from './common/app-dispatcher';
import NotificationsDataManager from './common/data-managers/notifications-data-manager';

import Home from './common/home';
import Header from './common/header';
import Menu from './common/menu';

import InfrastructureComponents from './ic/ics';
import InfrastructureComponent from './ic/ic';
import Dashboard from './dashboard/dashboard';
import Scenarios from './scenario/scenarios';
import Scenario from './scenario/scenario';
import Users from './user/users';
import User from './user/user';
import APIBrowser from './common/api-browser';
import LoginStore from './user/login-store'


import './styles/app.css';
import branding from './branding/branding';



class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  static getStores() {
    return [LoginStore]
  }

  componentDidMount() {
    NotificationsDataManager.setSystem(this.refs.notificationSystem);

    AppDispatcher.dispatch({
      type: 'config/load',
    });

    // if token stored locally, we are already logged-in
    let token = localStorage.getItem("token");
    if (token != null && token !== '') {

      let isExpired = this.tokenIsExpired(token);
      if (isExpired) {
        console.log("Token expired")
        AppDispatcher.dispatch({
          type: 'users/logout'
        });
      } else {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        console.log("Logged-in as user ", currentUser.username)
        AppDispatcher.dispatch({
          type: 'users/logged-in',
          token: token,
          currentUser: currentUser
        });
      }
    }
  }

  tokenIsExpired(token){
    let decodedToken = jwt.decode(token);
    let timeNow = (new Date().getTime() + 1) / 1000;
    return decodedToken.exp < timeNow;
  }

  render() {

    let token = localStorage.getItem("token");
    let currentUserRaw = localStorage.getItem("currentUser");

    if ((token == null || token === "" || currentUserRaw == null || currentUserRaw === "") || this.tokenIsExpired(token)) {
      console.log("APP redirecting to logout/ login")
      return (<Redirect to="/logout" />);
    }

    let currentUser = JSON.parse(currentUserRaw);
    let pages = branding.values.pages;

    return <DndProvider backend={HTML5Backend} >
        <div className="app">
          <NotificationSystem
            ref="notificationSystem"
          />
          <Header />

          <div className='app-body app-body-spacing'>
            <Menu currentRole={currentUser.role} />

            <div className='app-content app-content-margin-left'>
              <Route exact path="/" component={Home} />
              { pages.home ? <Route path="/home" component={Home} /> : '' }
              { pages.scenarios ? <Route exact path="/scenarios" component={Scenarios} /> : '' }
              { pages.scenarios ? <Route path="/scenarios/:scenario" component={Scenario} /> : '' }
              { pages.scenarios ? <Route path="/dashboards/:dashboard" component={Dashboard} /> : '' }
              { currentUser.role === "Admin" || pages.infrastructure ?
                <Route exact path="/infrastructure" component={InfrastructureComponents} />
              : '' }
              { currentUser.role === "Admin" || pages.infrastructure ?
                <Route path="/infrastructure/:ic" component={InfrastructureComponent} />
              : '' }
              { pages.account ? <Route path="/account" component={User} /> : '' }
              <Route path="/users" component={Users} />
              { pages.api ? <Route path="/api" component={APIBrowser} /> : '' }
            </div>
          </div>

          {branding.getFooter()}
        </div>
    </DndProvider>
  }
}


export default App
