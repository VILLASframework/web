/**
 * File: widget-factory.js
 * Description: A factory to create and pre-configure widgets
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import WidgetSlider from './widget-slider';

class WidgetFactory {

    static createWidgetOfType(type, position, defaultSimulator = null) {

        let widget = {
            name: 'Name',
            type: type,
            width: 100,
            height: 100,
            x: position.x,
            y: position.y,
            z: position.z,
            locked: false
        };

        // set type specific properties
        switch(type) {
            case 'Value':
                widget.simulator = defaultSimulator;
                widget.signal = 0;
                widget.minWidth = 70;
                widget.minHeight = 20;
                widget.width = 120;
                widget.height = 30;
                widget.textSize = 16;
                widget.name = 'Value';
                break;
            case 'Plot':
                widget.simulator = defaultSimulator;
                widget.signals = [ 0 ];
                widget.ylabel = '';
                widget.time = 60;
                widget.minWidth = 400;
                widget.minHeight = 200;
                widget.width = 400;
                widget.height = 200;
                break;
            case 'Table':
                widget.simulator = defaultSimulator;
                widget.minWidth = 200;
                widget.width = 300;
                widget.height = 200;
                break;
            case 'Label':
                widget.minWidth = 20;
                widget.minHeight = 20;
                widget.width = 100;
                widget.height = 35;
                widget.name = 'Label';
                widget.textSize = 32;
                widget.fontColor = 0;
                break;
            case 'PlotTable':
                widget.simulator = defaultSimulator;
                widget.preselectedSignals = [];
                widget.signals = []; // initialize selected signals
                widget.ylabel = '';
                widget.minWidth = 400;
                widget.minHeight = 300;
                widget.width = 500;
                widget.height = 500;
                widget.time = 60;
                break;
            case 'Image':
                widget.minWidth = 100;
                widget.minHeight = 100;
                widget.width = 200;
                widget.height = 200;
                widget.lockAspect = true;
                break;
            case 'Button':
                widget.minWidth = 100;
                widget.minHeight = 50;
                widget.width = 100;
                widget.height = 100;
                widget.background_color = 1;
                widget.font_color = 0;
                break;
            case 'NumberInput':
                widget.minWidth = 200;
                widget.minHeight = 50;
                widget.width = 200;
                widget.height = 50;
                break;
            case 'Slider':
                widget.minWidth = 380;
                widget.minHeight = 30;
                widget.width = 400;
                widget.height = 50;
                widget.orientation = WidgetSlider.OrientationTypes.HORIZONTAL.value; // Assign default orientation
                break;
            case 'Gauge':
                widget.simulator = defaultSimulator;
                widget.signal = 0;
                widget.minWidth = 200;
                widget.minHeight = 150;
                widget.width = 200;
                widget.height = 150;
                break;
            case 'Box':
                widget.minWidth = 50;
                widget.minHeight = 50;
                widget.width = 100;
                widget.height = 100;
                widget.border_color = 0;
                widget.z = 0;
                break;
            default:
                widget.width = 100;
                widget.height = 100;
        }
        return widget;
    }
}

export default WidgetFactory;