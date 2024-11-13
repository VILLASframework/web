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

import React, { useEffect } from "react";
import { useState } from "react";
import { Form, Col, Button, Card } from "react-bootstrap";
import Dialog from "../../../common/dialogs/dialog";
import { useGetScenariosQuery } from "../../../store/apiSlice";

const AddUsergroupDialog = ({ isModalOpened, onClose }) => {
  const [name, setName] = useState("");
  const [isValid, setIsValid] = useState(true);
  //each mapping is a 'scenarioID' and a bool value 'duplicate' that indicates wether this scenario is duplicated for each user in the group
  const [scenarioMappings, setScenarioMappings] = useState([]);

  const { data: { scenarios } = {}, isLoading: isLoadingScenarios } =
    useGetScenariosQuery();

  const checkValidity = (newName, newMappings) => {
    //group names have to be at lest 3 characters long and cannot start with spaces
    const isNameValid = newName.length >= 3 && !/^\s/.test(newName);
    //scenario ID is chosen from the dropdown therefore we just make sure that empty option is not selected
    const areMappingsValid = newMappings.every(
      (mapping) => mapping.scenarioID != ""
    );

    setIsValid(isNameValid && areMappingsValid);

    //this is only for the check before the submition
    return isNameValid && areMappingsValid;
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    if (!isValid) checkValidity(newName, scenarioMappings);
  };

  const handleRadioChange = (index, value) => {
    const updatedMappings = [...scenarioMappings];
    updatedMappings[index].duplicate = value === "duplicateScenarioForUsers";
    setScenarioMappings(updatedMappings);
  };

  const handleClose = (canceled) => {
    if (canceled) {
      onClose(null);
    } else {
      if (checkValidity(name, scenarioMappings)) {
        const scenarioMappingsModified = [...scenarioMappings].map(
          (mapping) => ({
            ...mapping,
            scenarioID: Number(mapping.scenarioID),
          })
        );
        onClose({
          name: name.trim(),
          scenarioMappings: scenarioMappingsModified,
        });
      }
    }
  };

  const handleReset = () => {
    setName("");
    setScenarioMappings([]);
  };

  const handleSelectChange = (index, value) => {
    const updatedMappings = [...scenarioMappings];
    updatedMappings[index].scenarioID = value;
    setScenarioMappings(updatedMappings);
    if (!isValid) checkValidity(name, updatedMappings);
  };

  const addCard = () =>
    setScenarioMappings((prevState) => [
      ...prevState,
      { scenarioID: "", duplicate: false },
    ]);

  const removeCard = (index) => {
    const updatedMappings = scenarioMappings.filter((_, i) => i !== index);
    setScenarioMappings(updatedMappings);
    if (!isValid) checkValidity(name, updatedMappings);
  };

  return (
    <Dialog
      show={isModalOpened}
      title="New User Group"
      buttonTitle="Add"
      onClose={handleClose}
      onReset={handleReset}
      valid={isValid}
    >
      <Form>
        <Form.Group as={Col} controlId="name" className="mt-2">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            isInvalid={!isValid && name.length < 3}
            value={name}
            onChange={handleNameChange}
          />
          <Form.Control.Feedback type="invalid">
            Name should not at least 3 characters long
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          onClick={addCard}
          className="mt-2 btn-secondary"
          disabled={scenarioMappings?.length >= scenarios?.length}
        >
          Add Scenario Mapping
        </Button>
        <div className="scrollable-list">
          {scenarioMappings.map((mapping, index) => (
            <Card key={index} className="mt-2">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <Form.Group
                    as={Col}
                    controlId={`radioGroup-${index}`}
                    style={{ marginBottom: "15px", flexGrow: 1 }}
                  >
                    <div>
                      <Form.Check
                        type="radio"
                        id={`addUsersToScenario-${index}`}
                        name={`options-${index}`}
                        label="Add users to scenario"
                        value="addUsersToScenario"
                        checked={!mapping.duplicate}
                        onChange={(e) =>
                          handleRadioChange(index, e.target.value)
                        }
                      />
                      <Form.Check
                        type="radio"
                        id={`duplicateScenarioForUsers-${index}`}
                        name={`options-${index}`}
                        label="Duplicate scenario for each user"
                        value="duplicateScenarioForUsers"
                        checked={mapping.duplicate}
                        onChange={(e) =>
                          handleRadioChange(index, e.target.value)
                        }
                      />
                    </div>
                  </Form.Group>

                  <Button
                    variant="danger"
                    onClick={() => removeCard(index)}
                    className="ms-auto"
                  >
                    Remove
                  </Button>
                </div>

                <Form.Group controlId={`scenario-${index}`}>
                  <Form.Label>Select Option</Form.Label>
                  {isLoadingScenarios ? (
                    <div>Loading...</div>
                  ) : (
                    <Form.Control
                      as="select"
                      isInvalid={!isValid && mapping.scenarioID == ""}
                      value={mapping.scenarioID}
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                    >
                      <option value="">-- Select scenario --</option>
                      {scenarios.map((scenario) => {
                        //is there already a mapping with this scenarioID?
                        const isOptionUnavailable = scenarioMappings.find(
                          (m) => m.scenarioID == scenario.id
                        );
                        return (
                          <option
                            key={scenario.id}
                            value={scenario.id}
                            style={
                              isOptionUnavailable
                                ? { backgroundColor: "lightgray" }
                                : {}
                            }
                            disabled={isOptionUnavailable}
                          >
                            {scenario.name}
                          </option>
                        );
                      })}
                    </Form.Control>
                  )}
                </Form.Group>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Form>
    </Dialog>
  );
};

export default AddUsergroupDialog;
