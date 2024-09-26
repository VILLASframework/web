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
import { useState, useEffect } from 'react';
import { Form, Col, Button} from 'react-bootstrap';
import Dialog from '../../../common/dialogs/dialog';

const RenameUsergroupDialog = ({isModalOpened, onClose, oldName}) => {

    const [name, setName] = useState(oldName);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (isModalOpened && oldName) {
            setName(oldName);
        }
    }, [isModalOpened, oldName]);

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
        setIsValid(newName.length >= 3 && !(/^\s/.test(newName)));
    }

    const handleClose = (canceled) => {
        if(canceled) {
            onClose(null);
        } else {
            onClose(name);
        }
    }

    const handleReset = () => {
        setName('');
    }

    return (<Dialog
      show={isModalOpened}
      title="Rename User Group"
      buttonTitle="Update"
      onClose={handleClose}
      onReset={handleReset}
      valid={isValid}>
      <Form>
        <Form.Group as={Col} controlId="name" style={{marginBottom: '15px'}}>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter new name" value={name} onChange={handleNameChange} />
          <Form.Control.Feedback />
        </Form.Group>
      </Form>
    </Dialog>);
}

export default RenameUsergroupDialog;
