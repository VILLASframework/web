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
        unit: '',

    };
  }

  static getDerivedStateFromProps(props, state){

    let value = ''
    let unit = ''

    if(props.widget.customProperties.hasOwnProperty('value') && props.widget.customProperties.value !== state.value){
      // set value to customProperties.value if this property exists and the value is different from current state
      value = Number(props.widget.customProperties.value);
    } else if (props.widget.customProperties.hasOwnProperty('default_value') && state.value === ''){
      // if customProperties.default_value exists and value has been assigned yet, set the value to the default_value
      value = Number(props.widget.customProperties.default_value)
    }

    // Update unit (assuming there is exactly one signal for this widget)
    if (props.widget.signalIDs.length > 0) {
      let signalID = props.widget.signalIDs[0];
      let signal = props.signals.find(sig => sig.id === signalID);
      if (signal !== undefined) {
        unit = signal.unit;
      }
    }

    if (unit !== '' && value !== ''){
      // unit and value have changed
      return {unit: unit, value: value};
    } else if (unit !== ''){
      // only unit has changed
      return {unit: unit}
    } else if (value !== ''){
      // only value has changed
      return {value: value}
    } else {
      // nothing has changed
      return null
    }
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    // Check if the orientation changed, update the size if it did
    // this part didn't work -> dimensions and constraints are now handled by the edit orientation component
    if (this.props.widget.customProperties.orientation !== prevProps.widget.customProperties.orientation) {
      let baseWidget = this.props.widget;

      // Exchange dimensions and constraints
      let newWidget = Object.assign({}, baseWidget, {
        width: baseWidget.height,
        height: baseWidget.width,
        minWidth: baseWidget.minHeight,
        minHeight: baseWidget.minWidth,
        maxWidth: baseWidget.customProperties.maxHeight,
        maxHeight: baseWidget.customProperties.maxWidth
      });

      this.props.onWidgetChange(newWidget);
    }

  }

  valueIsChanging(newValue) {
    this.props.widget.customProperties.value = newValue;
    if (this.props.widget.continous_update)
      this.valueChanged(newValue);

    this.setState({ value: newValue });
  }

  valueChanged(newValue) {
    if (this.props.onInputChanged) {
      this.props.onInputChanged(newValue, 'value', newValue);
    }
  }

  render() {

    let isVertical = this.props.widget.customProperties.orientation === WidgetSlider.OrientationTypes.VERTICAL.value;
    let fields = {
      name: this.props.widget.name,
      control: <Slider min={ this.props.widget.customProperties.rangeMin } max={ this.props.widget.customProperties.rangeMax } step={ this.props.widget.customProperties.step } value={ this.state.value } disabled={ this.props.editing } vertical={ isVertical } onChange={ (v) => this.valueIsChanging(v) } onAfterChange={ (v) => this.valueChanged(v) }/>,
      value: <span>{ format('.2f')(Number.parseFloat(this.state.value)) }</span>,
      unit: <span className="signal-unit">{ this.state.unit }</span>
    }

    var widgetClasses = classNames({
                    'slider-widget': true,
                    'full': true,
                    'vertical': isVertical,
                    'horizontal': !isVertical
                  });

    return (
        <div className={widgetClasses}>
          <label>{ fields.name }</label>
          { fields.control }
          <span>{ fields.value }</span>
          {this.props.widget.customProperties.showUnit && fields.unit}
        </div>
    );
  }
}

export default WidgetSlider;
