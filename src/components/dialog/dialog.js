/**
 * File: dialog.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2017
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
import { Modal, Button } from 'react-bootstrap';

class Dialog extends React.Component {
  closeModal() {
    this.props.onClose(false);
  }

  cancelModal() {
    this.props.onClose(true);
  }

  render() {
    return (
      <Modal show={this.props.show} onEnter={this.props.onReset}>
        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.props.children}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => this.cancelModal()}>Cancel</Button>
          <Button bsStyle="primary" type="submit" onClick={() => this.closeModal()} disabled={!this.props.valid}>{this.props.buttonTitle}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Dialog;
