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

import { useState } from "react";
import IconButton from "../../common/buttons/icon-button";
import { Form, Row, Col } from 'react-bootstrap';
import EditOwnUserDialog from "./edit-own-user";
import { currentUser } from "../../localStorage";
import NotificationsFactory from "../../common/data-managers/notifications-factory";
import notificationsDataManager from "../../common/data-managers/notifications-data-manager";
import { useUpdateUserMutation } from "../../store/apiSlice";

const Account = () => {

    const [isEditModalOpened, setIsEditModalOpened] = useState(false);
    const [updateUser] = useUpdateUserMutation();

    const buttonStyle = {
      marginLeft: '10px',
    }
  
    const iconStyle = {
      height: '30px',
      width: '30px'
    }

    const handleEdit = async (data) => {
        if(data){
            try {
                await updateUser(data);
            } catch (err) {
                if(err.data){
                    notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
                } else {
                    console.log('Error', err);
                }
            }
        }
        setIsEditModalOpened(false);
    }

    return (
        <div>
          <h1>Account
            <span className='icon-button'>
              <IconButton
                childKey={0}
                tooltip='Edit Account'
                onClick={() => setIsEditModalOpened(true)}
                icon='edit'
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
              />
            </span>
          </h1>
  
          {currentUser ?
            <>
              <Form>
                <Form.Group as={Row} controlId="username">
                  <Form.Label column sm={2}>Username</Form.Label>
                  <Col sm={10}>
                    <Form.Control plaintext readOnly value={currentUser.username} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="mail">
                  <Form.Label column sm={2}>E-mail</Form.Label>
                  <Col sm={10}>
                    <Form.Control plaintext readOnly value={currentUser.mail} type="email" />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="role">
                  <Form.Label column sm={2}>Role</Form.Label>
                  <Col sm={10}>
                    <Form.Control plaintext readOnly value={currentUser.role} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formBasicEmail">
                  <Form.Label column sm={2}>Created at</Form.Label>
                  <Col sm={10}>
                    <Form.Control plaintext readOnly value={currentUser.createdAt} />
                  </Col>
                </Form.Group>
  
              </Form>
  
              <EditOwnUserDialog
                show={isEditModalOpened}
                onClose={(data) => handleEdit(data)}
                user={currentUser}
              />
            </>
            : <div/>
          }
        </div>
      );
}

export default Account;
