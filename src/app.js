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
import HTML5Backend from 'react-dnd-html5-backend';
import NotificationSystem from 'react-notification-system';
import { Redirect, Route } from 'react-router-dom';

import AppDispatcher from './common/app-dispatcher';
import NotificationsDataManager from './common/data-managers/notifications-data-manager';

import Home from './common/home';
import Header from './common/header';
import Footer from './common/footer';
import Menu from './common/menu';

import InfrastructureComponents from './ic/ics';
import Dashboard from './dashboard/dashboard';
import Scenarios from './scenario/scenarios';
import Scenario from './scenario/scenario';
import Users from './user/users';
import User from './user/user';
import APIBrowser from './common/api-browser';

import './styles/app.css';
import Branding from './branding/branding';



class App extends React.Component {

  constructor(props) {
    super(props);

    AppDispatcher.dispatch({
      type: 'config/load',
    });

    this.setBrandingStyle();
    this.state = {} 
  }

  changeHead() {
    if (Branding.instance.default) {
      console.log("default branding");
      return;
    }
    document.title = Branding.instance.values.title + " " + Branding.instance.values.subtitle;
    var oldlink = document.getElementById('dynamic-favicon');

    var link = document.createElement('link');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon'
    link.href = Branding.instance.values.icon;

    if (oldlink) {
      document.head.removeChild(oldlink);
    }
    document.head.appendChild(link);
  }

  setBrandingStyle() {
    this.changeHead();

    const rootEl = document.querySelector(':root');
    let background = Branding.instance.getBackgroundColor();

    if (background) {
      document.body.style.backgroundColor = background;
    }

    let highlight = Branding.instance.getHighlightColor();
    if (highlight) {
      rootEl.style.setProperty('--highlights', highlight);
    }

    let primary = Branding.instance.getPrimaryTextColor();
    if (primary) {
      rootEl.style.setProperty('--primarytext', primary);
    }

    let secondary = Branding.instance.getSecondaryTextColor();
    if (secondary) {
      rootEl.style.setProperty('--secondarytext', secondary);
    }

    let font = Branding.instance.getFont();
    if (font) {
      rootEl.style.setProperty('--mainfont', font);
    }
  }

  componentDidMount() {
    NotificationsDataManager.setSystem(this.refs.notificationSystem);

    // if token stored locally, we are already logged-in
    let token = localStorage.getItem("token");
    if (token != null && token !== '') {
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      console.log("Already logged-in")
      AppDispatcher.dispatch({
        type: 'users/logged-in',
        token: token,
        currentUser: currentUser
      });
    }
  }

  render() {

    let token = localStorage.getItem("token");
    let currentUserRaw = localStorage.getItem("currentUser");

    if (token == null || token === "" || currentUserRaw == null || currentUserRaw === "") {
      console.log("APP redirecting to logout/ login")
      return (<Redirect to="/logout" />);
    }

    let currentUser = JSON.parse(currentUserRaw);

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
              <Route path="/home" component={Home} />
              <Route exact path="/scenarios" component={Scenarios} />
              <Route path="/scenarios/:scenario" component={Scenario} />
              <Route path="/dashboards/:dashboard" component={Dashboard} />
              <Route path="/infrastructure" component={InfrastructureComponents} />
              <Route path="/account" component={User} />
              <Route path="/users" component={Users} />
              <Route path="/api" component={APIBrowser} />
            </div>
          </div>

          <Footer />
        </div>
    </DndProvider>
  }
}


export default App
