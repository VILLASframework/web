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
import { Button, Modal, Form } from 'react-bootstrap';
import { Collapse } from 'react-collapse';

class DeleteDialog extends React.Component {
    onModalKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            this.props.onClose(false);
        }
      }

    render() {
        return <Modal keyboard show={this.props.show} onHide={() => this.props.onClose(false)} onKeyPress={this.onModalKeyPress}>
            <Modal.Header>
                <Modal.Title>Delete {this.props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                Are you sure you want to delete the {this.props.title} <strong>'{this.props.name}'</strong>?
                <Collapse isOpened={this.props.managedexternally} >
                    <Form.Label size="sm">The IC will be deleted if the respective manager sends "gone" state and no component config is using the IC anymore</Form.Label>
                </Collapse>
            </Modal.Body>

            <Modal.Footer>
            <span className='solid-button'>
                <Button variant='secondary' onClick={() => this.props.onClose(false)}>Cancel</Button>
            </span>
                <Button variant="danger" onClick={() => this.props.onClose(true)}>Delete</Button>
            </Modal.Footer>
        </Modal>;
    }
}

export default DeleteDialog;
