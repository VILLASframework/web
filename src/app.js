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
import jwt from 'jsonwebtoken';
import NotificationsDataManager from './common/data-managers/notifications-data-manager';
import Home from './common/home';
import Header from './common/header';
import Menu from './common/menu';
import InfrastructureComponent from './pages/infrastructure/ic';
import Scenarios from './pages/scenarios/scenarios';
import APIBrowser from './common/api-browser';
import Scenario from './pages/scenarios/scenario';
import Users from './pages/users/users';
import Dashboard from './pages/dashboards/dashboard';
import Account from './pages/account/account';
import './styles/app.css';
import './styles/login.css';
import branding from './branding/branding';
import Logout from './pages/login/logout';

import Infrastructure from './pages/infrastructure/infrastructure'

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    NotificationsDataManager.setSystem(this.refs.notificationSystem);
    let token = localStorage.getItem("token");
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
              { pages.scenarios ? <>
                <Route exact path="/scenarios">
                  <Scenarios />
                </Route>
                <Route exact path="/logout">
                  <Logout />
                </Route>
                <Route path="/scenarios/:scenario">
                  <Scenario />
                </Route>
                <Route path="/dashboards/:dashboard">
                  <Dashboard />
                </Route>
                <Route path="/dashboards-new/:dashboard">
                  <Dashboard />
                </Route>
                </>
              : '' }
              { currentUser.role === "Admin" || pages.infrastructure ? <>
                <Route exact path="/infrastructure">
                  <Infrastructure />
                </Route>
                <Route path="/infrastructure/:ic">
                  <InfrastructureComponent />
                </Route>
                </>
              : '' }
              { pages.account ? <Route path="/account"><Account /></Route> : '' }
              { currentUser.role === "Admin" ?
                <Route path="/users">
                  <Users />
                </Route>
              : '' }
              { currentUser.role === "Admin" || pages.api ?
                <Route path="/api" component={APIBrowser} />
              : '' }
            </div>
          </div>

          {branding.getFooter()}
        </div>
    </DndProvider>
  }
}

export default App;
