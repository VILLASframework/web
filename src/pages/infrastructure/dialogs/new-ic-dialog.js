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
import { useEffect, useState, useRef } from "react";
import Dialog from "../../../common/dialogs/dialog";
import { Form, OverlayTrigger, Dropdown, Tooltip } from "react-bootstrap";
import timeAgo from "../../../utils/timeAgo";
import uuidv4 from "../../../utils/uuidv4";
import FormFromParameterSchema from "./new-ic-form-builder";

/*
  If user chooses to create new IC using manager, we a building a form from parameter schema 
  provided by said manager. Otherwise, use the generic form.
*/

const NewICDiallog = ({ show, managers, onClose }) => {
  const [isManagedExternally, setIsManagedExternally] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  //form data that is used by the non-manager form
  const initialFormData = {
    name: "",
    location: "",
    description: "",
    uuid: uuidv4(),
    location: "",
    category: "",
    type: "",
    websocketURL: "",
    apiURL: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  //each time use manager check is toggled we want to set a proper initial values
  useEffect(() => {
    if (isManagedExternally) {
      setFormData((prevState) => ({
        category: prevState.category,
        type: prevState.type,
      }));
      setFormErrors({});
    } else {
      setFormData(initialFormData);
      setSelectedManager(null);
      setFormErrors({});
    }
  }, [isManagedExternally]);

  const handleChange = ({ target }) => {
    setFormData((prevState) => ({
      ...prevState,
      [target.id]: target.value,
    }));
    //clear errors when added new input
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [target.id]: "",
    }));
  };

  const handleClose = (c) => {
    if (c) {
      onClose(false);
    } else {
      if (validateForm()) {
        const icData = {
          data: { ...formData, ManagedExternally: isManagedExternally },
          manager: selectedManager,
        };
        onClose(icData);
      }
    }
  };

  useEffect(() => console.log(formErrors), [formErrors]);

  const onReset = () => {
    setFormData(initialFormData);
    setSelectedManager(null);
  };

  //ref for the form built by the manager's schema used to get its valdiation status
  const managerFormRef = useRef();

  const validateForm = () => {
    //we are validating type and category in both cases, but other validations will differ for generic and manager form
    const errors = {};

    if (!formData.category.trim() || formData.category == "Select category") {
      errors.category = "Category is required";
    }
    if (!formData.type.trim() || formData.category == "Select type") {
      errors.type = "Type is required";
    }

    if (isManagedExternally) {
      //when no parameter schema is provided, there is nothing to verify
      if (selectedManager.createparameterschema == null) {
        return true;
      }
      const isManagerFormValid = managerFormRef.current.validateForm();
      setFormErrors((prevState) => ({ ...errors, ...prevState }));
      return Object.keys(errors).length === 0 && isManagerFormValid;
    } else {
      if (!formData.name.trim()) {
        errors.name = "Name is required";
      }

      setFormErrors(errors);

      return Object.keys(errors).length === 0;
    }
  };

  return (
    <Dialog
      show={show}
      title="New Infrastructure Component"
      buttonTitle="Add"
      onClose={(c) => handleClose(c)}
      onReset={() => onReset()}
      valid={
        !Object.values(formErrors).some(
          (error) => error && error.trim() !== ""
        ) ||
        (selectedManager && selectedManager.createparameterschema == null)
      }
    >
      <Form>
        <Form.Check
          type={"checkbox"}
          label={"Use manager"}
          defaultChecked={false}
          onChange={(e) => setIsManagedExternally((prevState) => !prevState)}
        ></Form.Check>
      </Form>

      {
        //if its managed externally, then select a manager and build a form according to the schema of the manager,
        //use the generic form otherwise
        isManagedExternally ? (
          <div>
            <Form.Group controlId="manager">
              <Dropdown
                onSelect={(eventKey) =>
                  setSelectedManager(managers.find((m) => m.id == eventKey))
                }
              >
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-basic"
                  style={{ width: "100%", textAlign: "left" }}
                >
                  {selectedManager == null
                    ? "Select a manager"
                    : selectedManager.name + " " + selectedManager.id}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ width: "100%" }}>
                  {managers.map((manager) => (
                    <Dropdown.Item
                      key={manager.id}
                      eventKey={manager.id}
                      as="div"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        {manager.name + " " + manager.id}
                      </span>
                      <span style={{ color: "grey" }}>
                        {"created " + timeAgo(manager.createdAt)}
                      </span>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {selectedManager == null ||
              selectedManager?.createparameterschema == null ? (
                <></>
              ) : (
                <>
                  <FormFromParameterSchema
                    ref={managerFormRef}
                    createparameterschema={
                      selectedManager.createparameterschema
                    }
                    setParentFormData={setFormData}
                    setParentFormErrors={setFormErrors}
                  />
                  <Form.Group controlId="category" className="mt-2">
                    <OverlayTrigger
                      key="2"
                      placement={"right"}
                      overlay={
                        <Tooltip id={`tooltip-${"required"}`}>
                          {" "}
                          Required field{" "}
                        </Tooltip>
                      }
                    >
                      <Form.Label>Category of component *</Form.Label>
                    </OverlayTrigger>
                    <Form.Control
                      as="select"
                      isInvalid={!!formErrors.category}
                      value={formData.category}
                      onChange={(e) => handleChange(e)}
                    >
                      {
                        /*
                      this is done for the case, when createparameterschema, like the one from generic manager (which this check is created for), has its own type and category property
                      otherwise it would lead to a crash, since selects have predifined properties for the category and type, while manager's form utilizes textfileds which allows any input, which
                      can be different from the pre-defined options
                      */
                        formData.category == "" ||
                        typeOptionsMap[formData.category] ? (
                          <>
                            <option default>Select category</option>
                            <option value="simulator">Simulator</option>
                            <option value="service">Service</option>
                            <option value="gateway">Gateway</option>
                            <option value="equipment">Equipment</option>
                            <option value="manager">Manager</option>
                          </>
                        ) : (
                          <option default>{formData.category}</option>
                        )
                      }
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.category}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="type" className="mt-2">
                    <OverlayTrigger
                      key="3"
                      placement={"right"}
                      overlay={
                        <Tooltip id={`tooltip-${"required"}`}>
                          {" "}
                          Required field{" "}
                        </Tooltip>
                      }
                    >
                      <Form.Label>Type of component *</Form.Label>
                    </OverlayTrigger>
                    <Form.Control
                      as="select"
                      isInvalid={!!formErrors.type}
                      value={formData.type}
                      disabled={formData.category == ""}
                      onChange={(e) => handleChange(e)}
                    >
                      <option default>Select type</option>
                      {
                        /*
                      this is done for the case, when createparameterschema, like the one from generic manager (which this check is created for), has its own type and category property
                      otherwise it would lead to a crash, since selects have predifined properties for the category and type, while manager's form utilizes textfileds which allows any input, which
                      can be different from the pre-defined options
                      */
                        formData.category == "" ? (
                          <></>
                        ) : formData.category == "" ||
                          typeOptionsMap[formData.category] ? (
                          typeOptionsMap[formData.category].map(
                            (name, index) => <option key={index}>{name}</option>
                          )
                        ) : (
                          <option key={formData.type}>{formData.type}</option>
                        )
                      }
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.type}
                    </Form.Control.Feedback>
                  </Form.Group>
                </>
              )}
            </Form.Group>
          </div>
        ) : (
          //the generic form
          <Form>
            <Form.Group controlId="name">
              <OverlayTrigger
                key="1"
                placement={"right"}
                overlay={
                  <Tooltip id={`tooltip-${"required"}`}>
                    {" "}
                    Required field{" "}
                  </Tooltip>
                }
              >
                <Form.Label>Name *</Form.Label>
              </OverlayTrigger>
              <Form.Control
                isInvalid={!!formErrors.name}
                type="text"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => handleChange(e)}
              />

              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="uuid">
              <Form.Label>UUID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter uuid"
                value={formData.uuid}
                onChange={(e) => handleChange(e)}
              />
              <Form.Control.Feedback />
            </Form.Group>

            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Location"
                value={formData.location}
                onChange={(e) => handleChange(e)}
              />
              <Form.Control.Feedback />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Description"
                value={formData.description}
                onChange={(e) => handleChange(e)}
              />
              <Form.Control.Feedback />
            </Form.Group>

            <Form.Group controlId="category">
              <OverlayTrigger
                key="2"
                placement={"right"}
                overlay={
                  <Tooltip id={`tooltip-${"required"}`}>
                    {" "}
                    Required field{" "}
                  </Tooltip>
                }
              >
                <Form.Label>Category of component *</Form.Label>
              </OverlayTrigger>
              <Form.Control
                as="select"
                value={formData.category}
                onChange={(e) => handleChange(e)}
                isInvalid={!!formErrors.category}
              >
                <option default>Select category</option>
                <option value="simulator">Simulator</option>
                <option value="service">Service</option>
                <option value="gateway">Gateway</option>
                <option value="equipment">Equipment</option>
                <option value="manager">Manager</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {formErrors.category}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="type">
              <OverlayTrigger
                key="3"
                placement={"right"}
                overlay={
                  <Tooltip id={`tooltip-${"required"}`}>
                    {" "}
                    Required field{" "}
                  </Tooltip>
                }
              >
                <Form.Label>Type of component *</Form.Label>
              </OverlayTrigger>
              <Form.Control
                as="select"
                value={formData.type}
                disabled={formData.category == ""}
                onChange={(e) => handleChange(e)}
                isInvalid={!!formErrors.type}
              >
                <option default>Select type</option>
                {formData.category == "" ? (
                  <></>
                ) : (
                  typeOptionsMap[formData.category].map((name, index) => (
                    <option key={index}>{name}</option>
                  ))
                )}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {formErrors.type}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="websocketURL">
              <Form.Label>Websocket URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://"
                value={formData.websocketURL}
                onChange={(e) => handleChange(e)}
              />
              <Form.Control.Feedback />
            </Form.Group>

            <Form.Group controlId="apiURL">
              <Form.Label>API URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://"
                value={formData.apiURL}
                onChange={(e) => handleChange(e)}
              />
              <Form.Control.Feedback />
            </Form.Group>
          </Form>
        )
      }
    </Dialog>
  );
};

//a map of available parameter types accoding to the picked category
const typeOptionsMap = {
  simulator: [
    "dummy",
    "generic",
    "dpsim",
    "rtlab",
    "rscad",
    "rtlab",
    "kubernetes",
  ],
  manager: ["villas-node", "villas-relay", "generic", "kubernetes"],
  gateway: ["villas-node", "villas-relay"],
  service: ["ems", "custom"],
  equipment: [
    "chroma-emulator",
    "chroma-loads",
    "sma-sunnyboy",
    "fleps",
    "sonnenbatterie",
  ],
};

export default NewICDiallog;
