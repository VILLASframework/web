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

import { useEffect, useState } from "react";
import { Dropdown, Form } from "react-bootstrap";

//a dropdown with a checklist
//each item has to be an object and have parameters id and name
const MultiselectDropdown = ({ items, checkedInitialyIDs, onUpdate }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  //push items that are to be checked upon component mount
  useEffect(() => {
    if (checkedInitialyIDs.length > 0) {
      const initialItems = items.filter((item) =>
        checkedInitialyIDs.includes(item.id)
      );
      setSelectedItems(initialItems);
    }
  }, [checkedInitialyIDs]);

  const handleItemCheck = (item) => {
    let updatedList;

    if (selectedItems.some((i) => i.id === item.id)) {
      updatedList = selectedItems.filter((i) => i.id !== item.id);
    } else {
      updatedList = [...selectedItems, item];
    }

    setSelectedItems(updatedList);
    onUpdate(updatedList, item);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary">
        {selectedItems.length > 0
          ? selectedItems.map((i) => (
              <div style={{ color: "white" }}>{i.name}</div>
            ))
          : "Select file(s)..."}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {items.map((item) => (
          <Form.Check
            key={item.id}
            type="checkbox"
            label={item.name}
            checked={selectedItems.some((i) => i.id == item.id)}
            onChange={() => handleItemCheck(item)}
            style={{
              marginLeft: "0.5em",
              marginRight: "0.5em",
              paddingTop: "1em",
            }}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MultiselectDropdown;
