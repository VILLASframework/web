/**
 * File: app.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// import AppDispatcher from '../app-dispatcher';
import VillasStore from '../stores/villas-store';

import Header from '../components/header';
import Footer from '../components/footer';
import SidebarMenu from '../components/menu-sidebar';
import Home from './home';
import '../styles/app.css';

class App extends Component {
  static getStores() {
    return [ VillasStore ];
  }

  static calculateState() {
    return {
      villas: VillasStore.getState()
    };
  }

  render() {
    // get children
    var children = this.props.children;
    if (this.props.location.pathname === "/") {
      children = <Home />
    }

    return (
      <div className="app">
        <Header />
        <SidebarMenu />

        <div className="app-content">
          {children}
        </div>

        <Footer />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Container.create(App));
