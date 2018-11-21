/**
 * File: widget-factory.js
 * Description: A factory to create and pre-configure widgets
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 02.03.2017
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

import WidgetSlider from './widgets/slider';

class WidgetFactory {

    static createWidgetOfType(type, position, defaultSimulationModel = null) {

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
            case 'CustomAction':
                widget.action = {
                  action: 'start',
                  model: {
                    url: 'ftp://user:pass@example.com/projectA/model.zip'
                  },
                  parameters: {
                    timestep: 50e-6
                  }
                };
                widget.name = 'Action';
                widget.icon = 'star';
                widget.width = 100;
                widget.height = 50;
                widget.simulationModel = defaultSimulationModel;
                break;
            case 'Action':
                widget.simulationModel = defaultSimulationModel;
                break;
            case 'Lamp':
                widget.simulationModel = defaultSimulationModel;
                widget.signal = 0;
                widget.minWidth = 5;
                widget.minHeight = 5;
                widget.width = 20;
                widget.height = 20;
                widget.on_color = 6;
                widget.off_color = 8;
                widget.threshold = 0.5;
                break;
            case 'Value':
                widget.simulationModel = defaultSimulationModel;
                widget.signal = 0;
                widget.minWidth = 70;
                widget.minHeight = 20;
                widget.width = 120;
                widget.height = 30;
                widget.textSize = 16;
                widget.name = 'Value';
                widget.showUnit = false;
                break;
            case 'Plot':
                widget.simulationModel = defaultSimulationModel;
                widget.signals = [ 0 ];
                widget.ylabel = '';
                widget.time = 60;
                widget.minWidth = 400;
                widget.minHeight = 200;
                widget.width = 400;
                widget.height = 200;
                widget.yMin = 0;
                widget.yMax = 10;
                widget.yUseMinMax = false;
                break;
            case 'Table':
                widget.simulationModel = defaultSimulationModel;
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
                widget.simulationModel = defaultSimulationModel;
                widget.preselectedSignals = [];
                widget.signals = []; // initialize selected signals
                widget.ylabel = '';
                widget.minWidth = 200;
                widget.minHeight = 100;
                widget.width = 600;
                widget.height = 300;
                widget.time = 60;
                widget.yMin = 0;
                widget.yMax = 10;
                widget.yUseMinMax = false;
                break;
            case 'Image':
                widget.minWidth = 20;
                widget.minHeight = 20;
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
                widget.simulationModel = defaultSimulationModel;
                widget.signal = 0;
                break;
            case 'Input':
                widget.minWidth = 200;
                widget.minHeight = 50;
                widget.width = 200;
                widget.height = 50;
                widget.simulationModel = defaultSimulationModel;
                widget.signal = 0;
                break;
            case 'Slider':
                widget.minWidth = 380;
                widget.minHeight = 30;
                widget.width = 400;
                widget.height = 50;
                widget.orientation = WidgetSlider.OrientationTypes.HORIZONTAL.value; // Assign default orientation
                widget.simulationModel = defaultSimulationModel;
                widget.signal = 0;
                break;
            case 'Gauge':
                widget.simulationModel = defaultSimulationModel;
                widget.signal = 0;
                widget.minWidth = 100;
                widget.minHeight = 150;
                widget.width = 150;
                widget.height = 150;
                widget.colorZones = false;
                widget.zones = [];
                widget.valueMin = 0;
                widget.valueMax = 1;
                widget.valueUseMinMax = false;
                break;
            case 'Box':
                widget.minWidth = 50;
                widget.minHeight = 50;
                widget.width = 100;
                widget.height = 100;
                widget.border_color = 0;
                widget.z = 0;
                break;
            case 'HTML':
                widget.content = '<i>Hello World</i>';
                break;
            case 'Topology':
                widget.width = 600;
                widget.height = 400;
                break;

            default:
                widget.width = 100;
                widget.height = 100;
        }
        return widget;
    }
}

export default WidgetFactory;
