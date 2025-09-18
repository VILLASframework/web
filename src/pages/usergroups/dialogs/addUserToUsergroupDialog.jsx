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
import { Form, Col, Dropdown, Badge } from 'react-bootstrap';
import Dialog from '../../../common/dialogs/dialog';
import { useGetUsersQuery } from '../../../store/apiSlice';

const AddUserToUsergroupDialog = ({isModalOpened, onClose, currentUsers}) => {

    const [selectedUsers, setSelectedusers] = useState([]);
    const [isValid, setIsValid] = useState(false);

    const {data: {users} = {}, isLoading: isLoadingUsers} = useGetUsersQuery();

    const toggleUser = (event, option) => {
        event.preventDefault();
        if (selectedUsers.includes(option)) {
            setSelectedusers(prevState => ([...prevState.filter((item) => item !== option)]));
        } else {
            setSelectedusers(prevState => ([...prevState, option]));
        }
    }

    useEffect(() => {
        setIsValid(selectedUsers.length > 0);
    }, [selectedUsers]);

    const handleClose = (canceled) => {
        if(!canceled){
            onClose(selectedUsers);
        } else {
            onClose([]);
        }
    }

    const handleReset = () => {
        setSelectedusers([]);
    }
      
    return (
      <Dialog show={isModalOpened} title="Add Users" buttonTitle="Add" onClose={handleClose} onReset={handleReset} valid={isValid}>
        <Dropdown autoClose="outside">
            <Dropdown.Toggle variant="success" id="dropdown-basic">Select Options</Dropdown.Toggle>
            <Dropdown.Menu>
                {isLoadingUsers ? <div>Loading...</div> : [...users].filter(user => !currentUsers.some(currentUser => currentUser.id == user.id)).map(user => 
                    <Dropdown.Item
                        key={user.id} 
                        onClick={(event) => toggleUser(event, user)}
                        style={{
                            backgroundColor: selectedUsers.includes(user) ? '#d3d3d3' : ''
                        }}
                    >
                        {user.username}
                    </Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
        <div className='mt-4'>
            {selectedUsers.length > 0 ? selectedUsers.map(user => 
                <Badge className="fs-6 me-2 mb-2" key={user.id} bg="primary">{user.username}</Badge>) : <div className="fst-italic">No users selected</div>}
        </div>
      </Dialog>
    );    
}

export default AddUserToUsergroupDialog;
