/**
 * File: menu-sidebar.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Link } from 'react-router';

class SidebarMenu extends Component {
  render() {
    return (
      <div className="menu-sidebar">
        <h2>Menu</h2>

        <ul>
          <li><Link to="/home" activeClassName="active">Home</Link></li>
          <li><Link to="/projects" activeClassName="active">Projects</Link></li>
          <li><Link to="/simulations" activeClassName="active">Simulations</Link></li>
          <li><Link to="/simulators" activeClassName="active">Simulators</Link></li>
        </ul>
      </div>
    );
  }
}

export default SidebarMenu;
