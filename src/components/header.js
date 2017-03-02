/**
 * File: header.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';

import '../styles/app.css';

class Header extends Component {
  render() {
    return (
      <header className="app-header">
        <h1>VILLASweb</h1>
      </header>
    );
  }
}

export default Header;
