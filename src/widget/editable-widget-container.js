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
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Rnd } from 'react-rnd';

class EditableWidgetContainer extends React.Component {
  constructor(props) {
    super(props);

    this.rnd = null;
  }

  snapToGrid(value) {
    if (this.props.grid === 1) {
      return value;
    }

    return Math.round(value / this.props.grid) * this.props.grid;
  }

  borderWasClicked = event => {
    if (event.button !== 2) {
      return;
    }
  };

  drag = (event, data) => {
    const x = this.snapToGrid(data.x);
    const y = this.snapToGrid(data.y);

    if (x !== data.x || y !== data.y) {
      this.rnd.updatePosition({ x, y });
    }
  };

  dragStop = (event, data) => {
    const widget = this.props.widget;

    widget.x = this.snapToGrid(data.x);
    widget.y = this.snapToGrid(data.y);

    if (this.props.onWidgetChange != null) {
      this.props.onWidgetChange(widget, this.props.index);
    }
  };

  resizeStop = (event, direction, ref,delta, position) => {

    const widget = this.props.widget;

    // resize depends on direction
    if (direction === 'left' || direction === 'topLeft' || direction === 'bottomLeft') {
      widget.x -= delta.width;
    }

    if (direction === 'top' || direction === 'topLeft' || direction === 'topRight') {
      widget.y -= delta.height;
    }

    widget.width += delta.width;
    widget.height += delta.height;

    if (this.props.onWidgetChange != null) {
      this.props.onWidgetChange(widget, this.props.index);
    }
  };

  render() {
    const widget = this.props.widget;

    const resizing = {
      bottom: !widget.isLocked,
      bottomLeft: !widget.isLocked,
      bottomRight: !widget.isLocked,
      left: !widget.isLocked,
      right: !widget.idLocked,
      top: !widget.isLocked,
      topLeft: !widget.isLocked,
      topRight: !widget.isLocked
    };

    const gridArray = [ this.props.grid, this.props.grid ];

    const widgetClasses = classNames({
      'editing-widget': true,
      'locked': widget.isLocked
    });

    return <Rnd
      ref={c => { this.rnd = c; }}
      default={{ x: Number(widget.x), y: Number(widget.y), width: widget.width, height: widget.height }}
      minWidth={widget.minWidth}
      minHeight={widget.minHeight}
      lockAspectRatio={Boolean(widget.isLocked)}
      bounds={'parent'}
      className={widgetClasses}
      onResizeStart={this.borderWasClicked}
      onResizeStop={this.resizeStop}
      onDrag={this.drag}
      onDragStop={this.dragStop}
      dragGrid={gridArray}
      resizeGrid={gridArray}
      zindex={widget.z}
      enableResizing={resizing}
      disableDragging={widget.isLocked}
    >

        {this.props.children}

    </Rnd>;
  }
}

EditableWidgetContainer.propTypes = {
  widget: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  grid: PropTypes.number,
  onWidgetChange: PropTypes.func
};

export default EditableWidgetContainer
