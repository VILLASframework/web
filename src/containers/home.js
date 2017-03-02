/**
 * File: home.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Container } from 'flux/utils';

// import AppDispatcher from '../app-dispatcher';
import VillasStore from '../stores/villas-store';

import '../styles/home.css';

class Home extends Component {
  static getStores() {
    return [ VillasStore ];
  }

  static calculateState() {
    return {
      villas: VillasStore.getState()
    };
  }

  render() {
    return (
      <h1>Home</h1>
    );
  }
}

export default Container.create(Home);
