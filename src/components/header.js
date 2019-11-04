/**
 * File: header.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 *
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
import { Col, Button } from 'react-bootstrap';
import Icon from './icon';

class Header extends React.Component {
  render() {
    return (
      <header className="app-header">
        <Col xs={10} smOffset={2} sm={8}>
          <h1>VILLASweb</h1>
        </Col>
        <Col xs={2} smHidden mdHidden lgHidden style={{ paddingLeft: 'auto', paddingRight: 0 }}>
          {this.props.showMenuButton &&
            <Button bsStyle="link" onClick={this.props.onMenuButton} style={{ float: 'right', marginRight: '10px' }}><Icon size="3x" icon="bars" className="menu-icon" /></Button>
          }
        </Col>
      </header>
    );
  }
}

export default Header;
