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
import Config from '../config.js';


class RecoverPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      admin: Config.admin
    }
  }


  onClose() {
      this.props.onClose();
  }



  render() {
    return (
      <Dialog show={this.props.show} title="Recover password" buttonTitle="Close" onClose={(c) => this.onClose(c)} blendOutCancel = {true} valid={true} size = 'lg'>
        <div>
        <div>Please contact:</div>
        <div>{this.state.admin.name}</div>
        <div>E-Mail:</div>
        <a href={`mailto:${this.state.admin.mail}`}>{this.state.admin.mail}</a>          
      </div>
      </Dialog>
    );
  }
}

export default RecoverPassword;
