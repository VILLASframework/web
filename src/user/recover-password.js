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
import Dialog from '../common/dialogs/dialog';
import {Col, Row} from 'react-bootstrap';


class RecoverPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      admins: this.props.admins
    }
  }


  onClose() {
      this.props.onClose();
  }



  
  

  render() {
    return (
      <Dialog show={this.props.show} title="Recover password" buttonTitle="Close" onClose={(c) => this.onClose(c)} blendOutCancel = {true} valid={true}>
        <div>
        <span>Please contact an administrator</span>
        <div>
        {this.state.admins != null && this.state.admins.map(admin => (
          <form>
            <Row>
              <Col xs={3}>Admin: </Col>
              <Col xs={3}> {admin.username} </Col>
            </Row>


            <Row as={Col}>
              <Col xs={3}>E-mail: </Col>
              <Col xs={3}> {admin.mail} </Col>
            </Row>

          </form> 
          ))}
        </div>

          
      </div>
      </Dialog>
    );
  }
}

export default RecoverPassword;
