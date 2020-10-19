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

import WidgetSlider from './widgets/slider';

class WidgetFactory {

    static createWidgetOfType(type, position) {

        let widget = {
            name: 'Name',
            type: type,
            width: 100,
            height: 100,
            x: position.x,
            y: position.y,
            z: position.z,
            locked: false,
            customProperties: {},
            signalIDs: [],
        };

        // set type specific properties
        switch(type) {
            case 'CustomAction':
                widget.customProperties.actions = [
                  {
                    action: 'stop'
                  },
                  {
                    action: 'pause',
                    model: {
                      url: 'ftp://user:pass@example.com/projectA/model.zip'
                    },
                    parameters: {
                      timestep: 50e-6
                    }
                  }
                ];
                widget.name = 'Action';
                widget.customProperties.icon = 'star';
                widget.width = 100;
                widget.height = 50;
                break;
            case 'Action':
                break;
            case 'Lamp':
                widget.minWidth = 5;
                widget.minHeight = 5;
                widget.width = 20;
                widget.height = 20;
                widget.customProperties.on_color = '#4287f5';
                widget.customProperties.on_color_opacity = 1;
                widget.customProperties.off_color = '#4287f5';
                widget.customProperties.off_color_opacity = 1;
                widget.customProperties.threshold = 0.5;
                break;
            case 'Value':
                widget.minWidth = 70;
                widget.minHeight = 20;
                widget.width = 110;
                widget.height = 30;
                widget.customProperties.textSize = 16;
                widget.name = 'Value';
                widget.customProperties.showUnit = false;
                widget.customProperties.resizeTopBottomLock = true;
                break;
            case 'Plot':
                widget.customProperties.ylabel = '';
                widget.customProperties.time = 60;
                widget.minWidth = 400;
                widget.minHeight = 200;
                widget.width = 400;
                widget.height = 200;
                widget.customProperties.yMin = 0;
                widget.customProperties.yMax = 10;
                widget.customProperties.yUseMinMax = false;
                break;
            case 'Table':
                widget.minWidth = 200;
                widget.width = 300;
                widget.height = 200;
                widget.customProperties.showUnit = false;
                break;
            case 'Label':
                widget.minWidth = 20;
                widget.minHeight = 20;
                widget.customProperties.maxWidth = 100;
                widget.width = 100;
                widget.height = 35;
                widget.name = 'Label';
                widget.customProperties.textSize = 32;
                widget.customProperties.fontColor = '#4287f5';
                widget.customProperties.fontColor_opacity = 1;
                widget.customProperties.resizeTopBottomLock = true;
                break;
          case 'Image':
                widget.minWidth = 20;
                widget.minHeight = 20;
                widget.width = 200;
                widget.height = 200;
                widget.customProperties.lockAspect = true;
                widget.customProperties.file = -1; // ID of image file, -1 means non selected
                break;
            case 'Button':
                widget.minWidth = 100;
                widget.minHeight = 50;
                widget.width = 100;
                widget.height = 100;
                widget.customProperties.background_color = '#4287f5';
                widget.customProperties.font_color = '#4287f5';
                widget.customProperties.on_value = 1;
                widget.customProperties.off_value = 0;
                widget.customProperties.toggle = false;
                widget.customProperties.pressed = false;
                break;
            case 'NumberInput':
                widget.minWidth = 150;
                widget.minHeight = 50;
                widget.width = 200;
                widget.height = 50;
                widget.customProperties.showUnit = false;
                widget.customProperties.resizeTopBottomLock = true;
                widget.customProperties.value = '';
                break;
            case 'Slider':
                widget.minWidth = 380;
                widget.minHeight = 30;
                widget.width = 400;
                widget.height = 50;
                widget.customProperties.orientation = WidgetSlider.OrientationTypes.HORIZONTAL.value; // Assign default orientation
                widget.customProperties.rangeMin = 0;
                widget.customProperties.rangeMax = 200;
                widget.customProperties.rangeUseMinMax = true;
                widget.customProperties.showUnit = true;
                widget.customProperties.continous_update = false;
                widget.customProperties.default_value = '0';
                widget.customProperties.value = '';
                widget.customProperties.resizeLeftRightLock = false;
                widget.customProperties.resizeTopBottomLock = true;

                break;
            case 'Gauge':
                widget.minWidth = 100;
                widget.minHeight = 150;
                widget.width = 150;
                widget.height = 150;
                widget.customProperties.colorZones = false;
                widget.customProperties.zones = [];
                widget.customProperties.valueMin = 0;
                widget.customProperties.valueMax = 1;
                widget.customProperties.valueUseMinMax = false;
                break;
            case 'Box':
                widget.minWidth = 50;
                widget.minHeight = 50;
                widget.width = 100;
                widget.height = 100;
                widget.customProperties.border_color = '#4287f5';
                widget.customProperties.border_color_opacity = 1;
                widget.customProperties.background_color = '#961520';
                widget.customProperties.background_color_opacity = 1;
                widget.z = 0;
                break;
            /*case 'HTML':
                widget.customProperties.content = '<i>Hello World</i>';
                break;*/
            case 'Topology':
                widget.width = 600;
                widget.height = 400;
                widget.customProperties.file = -1; // ID of file, -1 means non selected
                break;
            case 'Line':
                widget.height = 100;
                widget.width = 100;
                widget.customProperties.border_color = '#4287f5';
                widget.customProperties.border_color_opacity = 1;
                widget.customProperties.border_width = 2;
                widget.customProperties.rotation = 0;
                break;

            default:
                widget.width = 100;
                widget.height = 100;
        }
        return widget;
    }
}

export default WidgetFactory;
