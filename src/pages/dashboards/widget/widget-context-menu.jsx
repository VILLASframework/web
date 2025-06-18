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

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Menu, Item, Separator } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

const WidgetContextMenu = ({
  index,
  widget,
  onEdit,
  onDuplicate,
  onDelete,
  onChange,
}) => {
  const editWidget = () => {
    if (onEdit) {
      onEdit(widget, index);
    }
  };

  const duplicateWidget = () => {
    if (onDuplicate) {
      onDuplicate(widget);
    }
  };

  const deleteWidget = () => {
    if (onDelete) {
      onDelete(widget, index);
    }
  };

  const moveAbove = () => {
    const updatedWidget = { ...widget, z: Math.min(widget.z + 10, 100) };
    if (onChange) {
      onChange(updatedWidget, index);
    }
  };

  const moveToFront = () => {
    const updatedWidget = { ...widget, z: 100 };
    if (onChange) {
      onChange(updatedWidget, index);
    }
  };

  const moveUnderneath = () => {
    const updatedWidget = { ...widget, z: Math.max(widget.z - 10, 0) };
    if (onChange) {
      onChange(updatedWidget, index);
    }
  };

  const moveToBack = () => {
    const updatedWidget = { ...widget, z: 0 };
    if (onChange) {
      onChange(updatedWidget, index);
    }
  };

  const lockWidget = () => {
    const updatedWidget = { ...widget, isLocked: true };
    if (onChange) {
      onChange(updatedWidget, index);
    }
  };

  const unlockWidget = () => {
    const updatedWidget = { ...widget, isLocked: false };
    if (onChange) {
      onChange(updatedWidget, index);
    }
  };

  const renderContextMenu = () => (
    <div>
      <Menu id={`widgetMenu${index}`}>
        <Item disabled={widget.locked} onClick={editWidget}>
          Edit
        </Item>
        <Item disabled={widget.locked} onClick={duplicateWidget}>
          Duplicate
        </Item>
        <Item disabled={widget.locked} onClick={deleteWidget}>
          Delete
        </Item>

        <Separator />

        <Item disabled={widget.locked} onClick={moveAbove}>
          Move above
        </Item>
        <Item disabled={widget.locked} onClick={moveToFront}>
          Move to front
        </Item>
        <Item disabled={widget.locked} onClick={moveUnderneath}>
          Move underneath
        </Item>
        <Item disabled={widget.locked} onClick={moveToBack}>
          Move to back
        </Item>

        <Separator />

        <Item disabled={widget.locked} onClick={lockWidget}>
          Lock
        </Item>
        <Item disabled={!widget.locked} onClick={unlockWidget}>
          Unlock
        </Item>
      </Menu>
    </div>
  );

  return ReactDOM.createPortal(renderContextMenu(), document.body);
};

WidgetContextMenu.propTypes = {
  index: PropTypes.number.isRequired,
  widget: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func,
  onDelete: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

export default WidgetContextMenu;
