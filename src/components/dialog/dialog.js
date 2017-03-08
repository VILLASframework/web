/**
 * File: dialog.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

class Dialog extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    buttonTitle: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
  };

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
