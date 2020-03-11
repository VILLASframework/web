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
import { Container } from 'flux/utils';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import NotificationSystem from 'react-notification-system';
import { Redirect, Route } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import { Hidden } from 'react-grid-system'

import AppDispatcher from './common/app-dispatcher';
import ScenarioStore from './scenario/scenario-store';
import ICStore from './ic/ic-store';
import LoginStore from './user/login-store';
import NotificationsDataManager from './common/data-managers/notifications-data-manager';

import Home from './common/home';
import Header from './common/header';
import Footer from './common/footer';
import SidebarMenu from './common/menu-sidebar';
import HeaderMenu from './common/header-menu';

import InfrastructureComponents from './ic/ics';
import Dashboard from './dashboard/dashboard';
import Scenarios from './scenario/scenarios';
import Scenario from './scenario/scenario';
import Users from './user/users';
import User from './user/user';

import './styles/app.css';

class App extends React.Component {

  static getStores() {
    return [ ICStore, LoginStore, ScenarioStore];
  }

  static calculateState(prevState) {

    return {
      ics: ICStore.getState(),
      scenarios: ScenarioStore.getState(),
      currentUser: LoginStore.getState().currentUser,
      token: LoginStore.getState().token,

      showSidebarMenu: false,
    };
  }

  componentDidMount() {
    NotificationsDataManager.setSystem(this.refs.notificationSystem);

    // if token stored locally, request user
    let token = localStorage.getItem("token");
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (token != null && token !== '') {
      AppDispatcher.dispatch({
        type: 'users/logged-in',
        token: token,
        currentUser: currentUser
      });
    }
  }

  showSidebarMenu = () => {
    this.setState({ showSidebarMenu: true });
  };

  hideSidebarMenu = () => {
    this.setState({ showSidebarMenu: false });
  };

  render() {
    if (this.state.token == null) {
      return (<Redirect to="/login" />);
    }

    return (
      <DndProvider backend={HTML5Backend} >
        <div>
          {/*
          <Col style={{ width: this.state.showSidebarMenu ? '280px' : '0px' }} smHidden mdHidden lgHidden className="sidenav">
          */}
          <Hidden sm md lg xl>
            <Col style={{ width: this.state.showSidebarMenu ? '280px' : '0px' }} className="sidenav">
                <HeaderMenu onClose={this.hideSidebarMenu} currentRole={this.state.currentUser.role} />
            </Col>
          </Hidden>

          <div className="app">
            <NotificationSystem ref="notificationSystem" />

            <Header onMenuButton={this.showSidebarMenu} showMenuButton={false} />

            <div className={`app-body app-body-spacing`} >
              <Col xs={false}>
                <SidebarMenu currentRole={this.state.currentUser.role} />
              </Col>

              <div className={`app-content app-content-margin-left`}>
                <Route exact path="/" component={Home} />
                <Route path="/home" component={Home} />
                <Route path="/dashboards/:dashboard" component={Dashboard} />
                <Route exact path="/scenarios" component={Scenarios} />
                <Route path="/scenarios/:scenario" component={Scenario} />
                <Route path="/infrastructure" component={InfrastructureComponents} />
                <Route path="/user" component={User} />
                <Route path="/users" component={Users} />
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </DndProvider>
    )
  }
}

let fluxContainerConverter = require('./common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(App));
//DragDropContext(HTML5Backend)(Container.create(App));
