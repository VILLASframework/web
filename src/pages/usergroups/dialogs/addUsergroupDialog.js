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
import { useState } from 'react';
import { Form, Col, Button} from 'react-bootstrap';
import Dialog from '../../../common/dialogs/dialog';
import { useGetScenariosQuery } from '../../../store/apiSlice';

const AddUsergroupDialog = ({isModalOpened, onClose}) => {

    const [name, setName] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [selectedOption, setSelectedOption] = useState('addUsersToScenario');
    const [selectedScenarioID, setSelectedScenarioID] = useState('');

    const {data: {scenarios} = {}, isLoading: isLoadingScenarios} = useGetScenariosQuery();

    const checkValidity = (name, scenarioID) => {
        //group names have to be at lest 3 characters long and cannot start with spaces
        const isNameValid = name.length >= 3 && !(/^\s/.test(name));
        //scenario ID is chosen from the dropdown therefore we just make sure that empty option is not selected
        const isScenarioIDValid = scenarioID !== '';
        setIsValid(isNameValid && isScenarioIDValid);
    }

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
        checkValidity(newName, selectedScenarioID);
    }

    const handleRadioChange = (e) => {
        setSelectedOption(e.target.value);
    }

    const handleClose = (canceled) => {
        if(canceled) {
            onClose(null);
        } else {
            onClose({name: name, scenarioID: selectedScenarioID, isDuplicateSelected: selectedOption === 'duplicateScenarioForUsers'});
        }
    }

    const handleReset = () => {
        setName('');
    }

    const handleSelectChange = (e) => {
        setSelectedScenarioID(e.target.value);
        checkValidity(name, e.target.value);
    };

    return (<Dialog
      show={isModalOpened}
      title="New User Group"
      buttonTitle="Add"
      onClose={handleClose}
      onReset={handleReset}
      valid={isValid}>
      <Form>
        <Form.Group as={Col} controlId="name" style={{marginBottom: '15px'}}>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" value={name} onChange={handleNameChange} />
          <Form.Control.Feedback />
        </Form.Group>
        <Form.Group as={Col} controlId="radioGroup" style={{ marginBottom: '15px' }}>
          <div>
            <Form.Check
              type="radio"
              id="addUsersToScenario"
              name="options"
              label="Add users to scenario"
              value="addUsersToScenario"
              checked={selectedOption === 'addUsersToScenario'}
              onChange={handleRadioChange}
            />
            <Form.Check
              type="radio"
              id="duplicateScenarioForUsers"
              name="options"
              label="Duplicate scenario for each user"
              value="duplicateScenarioForUsers"
              checked={selectedOption === 'duplicateScenarioForUsers'}
              onChange={handleRadioChange}
            />
          </div>
        </Form.Group>

        <Form.Group controlId="scenario">
        <Form.Label>Select Option</Form.Label>
        {isLoadingScenarios ? <div>Loading...</div> : (
            <Form.Control as="select" value={selectedScenarioID} onChange={handleSelectChange}>
            <option value="">-- Select scenario --</option>
            {scenarios.map(scenario => <option key={scenario.id} value={scenario.id}>{scenario.name}</option>)}
            </Form.Control>
        )}
      </Form.Group>
      </Form>
    </Dialog>);
}

export default AddUsergroupDialog;
