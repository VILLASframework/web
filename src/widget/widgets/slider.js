/**
 * File: slider.js
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
import { format } from 'd3';
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
        unit: 'bla',
        
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.simulationModel == null) {
      return;
    }

    // Update value
    if (nextProps.widget.customProperties.default_value && this.state.value === undefined) {
      this.setState({
        value: nextProps.widget.customProperties.default_value,
      });
    }

    // Update unit
    if (nextProps.widget.customProperties.simulationModel && nextProps.simulationModel.inputMapping && this.state.unit !== nextProps.simulationModel.inputMapping[nextProps.widget.customProperties.signal].type) {
      this.setState({
        unit: nextProps.simulationModel.inputMapping[nextProps.widget.customProperties.signal].type
      });
    }

    // Check if the orientation changed, update the size if it did
    if (this.props.widget.customProperties.orientation !== nextProps.widget.customProperties.orientation) {
      let baseWidget = nextProps.widget;

      // Exchange dimensions and constraints
      let newWidget = Object.assign({}, baseWidget, {
        width: baseWidget.height,
        height: baseWidget.width,
        minWidth: baseWidget.minHeight,
        minHeight: baseWidget.minWidth,
        maxWidth: baseWidget.customProperties.maxHeight,
        maxHeight: baseWidget.customProperties.maxWidth
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
    let isVertical = this.props.widget.customProperties.orientation === WidgetSlider.OrientationTypes.VERTICAL.value;
    let fields = {
      name: this.props.widget.name,
      control: <Slider min={ this.props.widget.customProperties.rangeMin } max={ this.props.widget.customProperties.rangeMax } step={ this.props.widget.customProperties.step } value={ this.state.value } disabled={ this.props.editing } vertical={ isVertical } onChange={ (v) => this.valueIsChanging(v) } onAfterChange={ (v) => this.valueChanged(v) }/>,
      value: <span>{ format('.3s')(Number.parseFloat(this.state.value)) }</span>,
      unit: <span className="signal-unit">{ this.state.unit }</span>
    }

    var widgetClasses = classNames({
                    'slider-widget': true,
                    'full': true,
                    'vertical': isVertical,
                    'horizontal': !isVertical
                  });

    return (
       !isVertical? (
        <div className={widgetClasses}>
          <label>{ fields.name }</label>
          <div className='slider'>{ fields.control }</div>
          <span>{ fields.value }</span>
        </div>
      ) : (
        <div className={widgetClasses}>
          <label>{ fields.name }</label>
          { fields.control }
          { fields.value }
          { this.props.widget.customProperties.showUnit && fields.unit }
        </div>
      )
    );
  }
}

export default WidgetSlider;
