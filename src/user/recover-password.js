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
import { Container } from 'flux/utils';
import LoginStore from './login-store'
import _ from 'lodash';


class RecoverPassword extends React.Component {

  static getStores() {
    return [LoginStore]
  }

  static calculateState(prevState, props) {
    return {
      config: LoginStore.getState().config
    }
  }

  onClose() {
      this.props.onClose();
  }

  render() {
    return (
      <Dialog
        show={this.props.show}
        title="Recover password"
        buttonTitle="Close"
        onClose={(c) => this.onClose(c)}
        blendOutCancel={true}
        valid={true}
      >
        <div>
          <h5>Please contact:</h5>
          <div>{_.get(this.state.config, ['contact', 'name'])}</div>
          <a href={`mailto:${_.get(this.state.config, ['contact', 'mail'])}`}>{_.get(this.state.config, ['contact', 'mail'])}</a>
        </div>
      </Dialog>
    );
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(RecoverPassword));