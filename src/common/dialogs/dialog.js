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
import { Modal, Button } from 'react-bootstrap';

class Dialog extends React.Component {
  closeModal = (event) => {
    this.props.onClose(false);
  }

  cancelModal = (event) => {
    this.props.onClose(true);
  }

  /**
   * To prevent Enter hanlding user onKeyPress={this.handleKeyIgnore} in that form element
   * and the following handler in the corresponding file:
   *
   * //this function prevents a keystroke from beeing handled by dialog.js
   * handleKeyIgnore(event){
   *   event.stopPropagation();
   * }
   */
  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      // prevent input from submitting
      event.preventDefault();
      this.closeModal(false);
    }
  }

  render() {
    return (
      <Modal size={this.props.size || 'sm'} keyboard show={this.props.show} onEnter={this.props.onReset} onHide={this.cancelModal} onKeyPress={this.onKeyPress}>
        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.props.children}
        </Modal.Body>

        <Modal.Footer>
         {this.props.blendOutCancel? <div></div>:  <Button onClick={this.cancelModal}>Cancel</Button>}
          <Button onClick={this.closeModal} disabled={!this.props.valid}>{this.props.buttonTitle}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Dialog;
