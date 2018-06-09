/**
 * File: widget-slider.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 30.03.2017
 * Copyright: 2018, Institute for Automation of Complex Power Systems, EONERC
 *
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

import React, { Component } from 'react';
import classNames from 'classnames';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class WidgetSlider extends Component {

  static get OrientationTypes() {
    return ({
      HORIZONTAL: {value: 0, name: 'Horizontal'},
      VERTICAL: {value: 1, name: 'Vertical'}
    })
  }

  constructor(props) {
    super(props);

    this.state = {
        value: Number.parseFloat(this.props.widget.default_value),
        unit: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.simulationModel == null) {
      return;
    }

    // Update value
    if (nextProps.widget.value && this.state.value !== nextProps.widget.value) {
      this.setState({
        value: nextProps.widget.value,
      });
    }

    // Update unit
    if (nextProps.widget.simulationModel && this.state.unit !== nextProps.simulationModel.inputMapping[nextProps.widget.signal].type) {
      this.setState({
        unit: nextProps.simulationModel.inputMapping[nextProps.widget.signal].type
      });
    }

    // Check if the orientation changed, update the size if it did
    if (this.props.widget.orientation !== nextProps.widget.orientation) {
      let baseWidget = nextProps.widget;
      // Exchange dimensions and constraints
      let newWidget = Object.assign({}, baseWidget, {
        width: baseWidget.height,
        height: baseWidget.width,
        minWidth: baseWidget.minHeight,
        minHeight: baseWidget.minWidth,
        maxWidth: baseWidget.maxHeight,
        maxHeight: baseWidget.maxWidth
      });
      nextProps.onWidgetChange(newWidget);
    }
  }

  valueIsChanging(newValue) {
    if (this.props.widget.continous_update)
      this.valueChanged(newValue);

    this.setState({ value: newValue });
  }

  valueChanged(newValue) {
    if (this.props.onInputChanged) {
      this.props.onInputChanged(newValue);
    }
  }

  render() {
    let isVertical = this.props.widget.orientation === WidgetSlider.OrientationTypes.VERTICAL.value;

    let fields = {
      'name': this.props.widget.name,
      'control': <Slider min={ this.props.widget.rangeMin } max={ this.props.widget.rangeMax } step={ Number.parseFloat(this.props.widget.step) } value={ this.state.value } disabled={ this.props.editing } vertical={ isVertical } onChange={ (v) => this.valueIsChanging(v) } onAfterChange={ (v) => this.valueChanged(v) }/>,
      'value': Number.parseFloat(this.state.value).toPrecision(3)
    }

    if (this.props.widget.showUnit)
      fields.value += ' [' + this.state.unit + ']';

    var widgetClasses = classNames({
                    'slider-widget': true,
                    'full': true,
                    'vertical': isVertical,
                    'horizontal': !isVertical
                  });

    return (
      this.props.widget.orientation === WidgetSlider.OrientationTypes.HORIZONTAL.value? (
        <div className={widgetClasses}>
          <label>{ fields.name }</label>
          <div className='slider'>{ fields.control }</div>
          <span>{ fields.value }</span>
        </div>
      ) : (
        <div className={widgetClasses}>
          <label>{ fields.name }</label>
          { fields.control }
          <span>{ fields.value }</span>
        </div>
      )
    );
  }
}

export default WidgetSlider;
