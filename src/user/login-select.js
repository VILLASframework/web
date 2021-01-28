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

import React, { Component } from 'react';
import { Form, Button, FormGroup, FormControl, FormLabel, Col } from 'react-bootstrap';
import Header from '../common/header';
import Footer from '../common/footer';
import { withRouter } from 'react-router-dom';



class LoginSelect extends Component {


  villaswebLogin = e => {
    this.props.history.replace('/villaslogin');
  }

  render() {

    return (
      <div>
        <Header />
        <div className="login-select">
          <Form>
            <Button variant="primary" block onClick={this.villaswebLogin}>VillasWeb login</Button>
            <br />
            <Button variant="primary" block onClick={e => window.location = this.props.loginURL }>{this.props.provider} login</Button>
          </Form>
        </div>

          <Footer />
    
      </div>
    );
  }
}

export default withRouter(LoginSelect);
