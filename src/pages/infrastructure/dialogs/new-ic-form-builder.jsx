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

import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Form, OverlayTrigger, Dropdown, Tooltip } from "react-bootstrap";

//Builds a form using a schema from IC Manager
//ref is for the new ic modal to validate the whole together
const FormFromParameterSchema = forwardRef(
  ({ createparameterschema, setParentFormData, setParentFormErrors }, ref) => {
    if (!createparameterschema) return null;

    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});

    //After initialization we want to set the initial values for the generated form
    useEffect(() => {
      if (createparameterschema !== null && createparameterschema.properties) {
        Object.entries(createparameterschema.properties).forEach(
          ([key, property]) => {
            setFormData((prevState) => ({
              ...prevState,
              [key]: property?.default || "",
            }));
            setParentFormData((prevState) => ({
              ...prevState,
              [key]: property?.default || "",
            }));
          }
        );
      }
    }, [createparameterschema]);

    const handleChange = ({ target }) => {
      const { id, value, type, checked } = target;
      setFormData((prevState) => ({
        ...prevState,
        [id]: type === "checkbox" ? checked : value,
      }));
      setFormErrors((prevState) => ({
        ...prevState,
        [id]: "",
      }));
      setParentFormData((prevState) => ({
        ...prevState,
        [id]: type === "checkbox" ? checked : value,
      }));
      setParentFormErrors((prevState) => ({
        ...prevState,
        [id]: "",
      }));
    };

    //schema has an array of required fields
    const validateForm = () => {
      const errors = {};
      createparameterschema.required?.forEach((key) => {
        if (!formData[key]) {
          errors[key] = "This field is required";
        }
      });

      setFormErrors(errors);
      setParentFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    //this is for new ic modal to call when handling submition
    useImperativeHandle(ref, () => ({
      validateForm,
    }));

    return (
      <div>
        <h2 className="mt-3">{createparameterschema.title || ""}</h2>
        {Object.entries(createparameterschema.properties).map(
          ([key, property]) => {
            const isRequired = createparameterschema.required?.includes(key);
            //filter the type and category fields as they are always in the parent form

            console.log("ADDING FIELD WITH KEY", key);

            if (key != "type" && key != "category") {
              //right now only text field and checkbox are supported. Text field is default
              return property.type != "boolean" ? (
                <Form.Group key={key} controlId={key}>
                  {isRequired ? (
                    <OverlayTrigger
                      placement="right"
                      overlay={<Tooltip>Required field</Tooltip>}
                    >
                      <Form.Label>{property.title} *</Form.Label>
                    </OverlayTrigger>
                  ) : (
                    <Form.Label>{property.title}</Form.Label>
                  )}
                  <Form.Control
                    isInvalid={!!formErrors[key]}
                    type={"text"}
                    placeholder={"Enter " + property.title}
                    value={formData[key] || ""}
                    onChange={(e) => handleChange(e)}
                  />
                  {isRequired ? (
                    <Form.Control.Feedback type="invalid">
                      {formErrors[key]}
                    </Form.Control.Feedback>
                  ) : (
                    <></>
                  )}
                </Form.Group>
              ) : (
                <Form.Check
                  type={"checkbox"}
                  label={property.title}
                  defaultChecked={false}
                  id={key}
                  onChange={(e) => handleChange(e)}
                ></Form.Check>
              );
            }
          }
        )}
      </div>
    );
  }
);

export default FormFromParameterSchema;
