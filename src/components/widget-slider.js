/**
 * File: widget-slider.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 30.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

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
        value: 50
    };
  }

  componentWillReceiveProps(nextProps) {
    // Update value
    if (nextProps.widget.value && this.state.value !== nextProps.widget.value) {
      this.setState({ value: nextProps.widget.value })
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
      'control': <Slider min={0} max={100} value={ this.state.value } step={ 0.1 } disabled={ this.props.editing } vertical={ isVertical } onChange={ (v) => this.valueIsChanging(v) } onAfterChange={ (v) => this.valueChanged(v) }/>,
      'value': this.state.value
    }

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
