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

class WidgetSlider extends Component {

  static  get OrientationTypes() { 
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

  valueChanged(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    let fields = {
      'name': this.props.widget.name,
      'control': <input type="range"  min="0" max="100" disabled={ this.props.editing } onChange={ (e) => this.valueChanged(e) } defaultValue={ this.state.value }/>,
      'value': this.state.value
    }

    let vertical = this.props.widget.orientation === WidgetSlider.OrientationTypes.VERTICAL.value;
    var widgetClasses = classNames({
                    'slider-widget': true,
                    'full': true,
                    'vertical': vertical,
                    'horizontal': !vertical
                  });

    return (
      this.props.widget.orientation === WidgetSlider.OrientationTypes.HORIZONTAL.value? (
        <div className={widgetClasses}>
          <div>
            <label>{ fields.name }</label>
          </div>
          <div>
            { fields.control }
            <span>{ fields.value }</span>
          </div>
        </div>
      ) : (
        <div className={widgetClasses}>
          <div>
            <label>{ fields.name }</label>
            <span>{ fields.value }</span>
          </div>
          <div>{ fields.control }</div>
        </div>
      )
    );
  }
}

export default WidgetSlider;