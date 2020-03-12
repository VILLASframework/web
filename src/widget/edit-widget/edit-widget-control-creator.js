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
 **********************************************************************************/

import React from 'react';

import EditWidgetTextControl from './edit-widget-text-control';
import EditWidgetNumberControl from './edit-widget-number-control';
import EditWidgetColorControl from './edit-widget-color-control';
import EditWidgetTimeControl from './edit-widget-time-control';
import EditImageWidgetControl from './edit-widget-image-control';
import EditWidgetSignalControl from './edit-widget-signal-control';
import EditWidgetSignalsControl from './edit-widget-signals-control';
import EditWidgetOrientation from './edit-widget-orientation';
import EditWidgetAspectControl from './edit-widget-aspect-control';
import EditWidgetTextSizeControl from './edit-widget-text-size-control';
import EditWidgetCheckboxControl from './edit-widget-checkbox-control';
import EditWidgetColorZonesControl from './edit-widget-color-zones-control';
import EditWidgetMinMaxControl from './edit-widget-min-max-control';
import EditWidgetHTMLContent from './edit-widget-html-content';
import EditWidgetParametersControl from './edit-widget-parameters-control';

export default function CreateControls(widgetType = null, widget = null, sessionToken = null, files = null, signals, handleChange) {
    // Use a list to concatenate the controls according to the widget type
    var DialogControls = [];

    switch(widgetType) {
        case 'CustomAction':
            DialogControls.push(
              <EditWidgetTextControl key={0} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
              <EditWidgetTextControl key={1} widget={widget} controlId={'icon'} label={'Icon'} placeholder={'Enter an awesome font icon name'} handleChange={e => handleChange(e)} />,
              <EditWidgetParametersControl key={2} widget={widget} controlId={'actions'} label={'Actions'} handleChange={(e) => handleChange(e)} />
            );
            break;
        case 'Action':
            DialogControls.push(
              <EditWidgetSignalControl key={0} widget={widget} signals={signals} handleChange={(e) => handleChange(e)} />,
            );
            break;
        case 'Value':
            DialogControls.push(
                <EditWidgetTextControl key={0} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
                <EditWidgetSignalControl key={1} widget={widget} signals={signals} handleChange={(e) => handleChange(e)} />,
                <EditWidgetTextSizeControl key={2} widget={widget} handleChange={e => handleChange(e)} />,
                <EditWidgetCheckboxControl key={3} widget={widget} controlId={'showUnit'} text="Show unit" handleChange={e => handleChange(e)} />
            );
            break;
        case 'Lamp':
              DialogControls.push(
                <EditWidgetSignalControl key={0} widget={widget} signals={signals} handleChange={(e) => handleChange(e)} />,
                <EditWidgetTextControl key={1} widget={widget} controlId={'customProperties.threshold'} label={'Threshold'} placeholder={'0.5'} handleChange={e => handleChange(e)} />,
                <EditWidgetColorControl key={2} widget={widget} controlId={'on_color'} label={'Color On'} handleChange={(e) => handleChange(e)} />,
                <EditWidgetColorControl key={3} widget={widget} controlId={'off_color'} label={'Color Off'} handleChange={(e) => handleChange(e)} />,
              );
              break;
        case 'Plot':
            DialogControls.push(
                <EditWidgetTimeControl key={0} widget={widget} handleChange={(e) => handleChange(e)} />,
                <EditWidgetSignalsControl key={1} controlId={'signalIDs'} widget={widget} signals={signals} handleChange={(e) => handleChange(e)} />,
                <EditWidgetTextControl key={2} controlId={'customProperties.ylabel'} label={'Y-Axis name'} placeholder={'Enter a name for the y-axis'} widget={widget} handleChange={(e) => handleChange(e)} />,
                <EditWidgetMinMaxControl key={3} widget={widget} controlId="y" handleChange={e => handleChange(e)} />
            );
            break;
        case 'Table':
            DialogControls.push(
                <EditWidgetSignalsControl key={0} controlId={'signalIDs'} widget={widget} signals={signals} handleChange={(e) => handleChange(e)} />,
                <EditWidgetCheckboxControl key={1} widget={widget} controlId={'showUnit'} text="Show unit" handleChange={e => handleChange(e)} />
            );
            break;
        case 'Image':
            // Restrict to only image file types (MIME)
            let imageControlFiles = files == null? [] : files.filter(file => file.type.includes('image'));
            DialogControls.push(
                <EditImageWidgetControl key={0} sessionToken={sessionToken} widget={widget} files={imageControlFiles} handleChange={(e) => handleChange(e)} />,
                <EditWidgetAspectControl key={1} widget={widget} handleChange={e => handleChange(e)} />
            );
            break;
        case 'Gauge':
            DialogControls.push(
                <EditWidgetTextControl key={0} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
                <EditWidgetSignalControl key={1} widget={widget} signals={signals} handleChange={(e) => handleChange(e)} />,
                <EditWidgetCheckboxControl key={2} widget={widget} controlId="colorZones" text="Show color zones" handleChange={e => handleChange(e)} />,
                <EditWidgetColorZonesControl key={3} widget={widget} handleChange={e => handleChange(e)} />,
                <EditWidgetMinMaxControl key={4} widget={widget} controlId="value" handleChange={e => handleChange(e)} />
            );
            break;
        case 'PlotTable':
            DialogControls.push(
                <EditWidgetSignalsControl key={0} controlId={'signalIDs'} widget={widget} signals={signals} handleChange={(e) => handleChange(e)} />,
                <EditWidgetTextControl key={1} controlId={'ylabel'} label={'Y-Axis'} placeholder={'Enter a name for the Y-axis'} widget={widget} handleChange={(e) => handleChange(e)} />,
                <EditWidgetTimeControl key={2} widget={widget} handleChange={(e) => handleChange(e)} />,
                <EditWidgetMinMaxControl key={3} widget={widget} controlId="y" handleChange={e => handleChange(e)} />
            );
            break;
        case 'Slider':
            DialogControls.push(
                <EditWidgetTextControl key={0} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
                <EditWidgetOrientation key={1} widget={widget} handleChange={(e) => handleChange(e)} />,
                <EditWidgetSignalControl key={2} widget={widget} input signals={signals} handleChange={(e) => handleChange(e)} />,
                <EditWidgetCheckboxControl key={3} text={'Continous Update'} controlId={'continous_update'} widget={widget} input handleChange={(e) => handleChange(e)} />,
                <EditWidgetCheckboxControl key={4} widget={widget} controlId={'showUnit'} text="Show unit" handleChange={e => handleChange(e)} />,
                <EditWidgetMinMaxControl key={5} widget={widget} controlId={'range'} handleChange={e => handleChange(e)} />,
                <EditWidgetNumberControl key={6} widget={widget} controlId={'step'} label={'Step Size'} defaultValue={0.1} handleChange={(e) => handleChange(e)} />,
                <EditWidgetNumberControl key={7} widget={widget} controlId={'default_value'} label={'Default Value'} defaultValue={50} handleChange={(e) => handleChange(e)} />
            );
            break;
        case 'Button':
            DialogControls.push(
                <EditWidgetTextControl key={0} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
                <EditWidgetSignalControl key={1} widget={widget} input signals={signals} handleChange={(e) => handleChange(e)} />,
                <EditWidgetCheckboxControl key={2} widget={widget} controlId={'toggle'} text="Toggle" handleChange={e => handleChange(e)} />,
                <EditWidgetNumberControl key={3} widget={widget} controlId={'on_value'} label={'On Value'} defaultValue={1} handleChange={(e) => handleChange(e)} />,
                <EditWidgetNumberControl key={4} widget={widget} controlId={'off_value'} label={'Off Value'} defaultValue={0} handleChange={(e) => handleChange(e)} />
            );
            break;
        case 'Box':
            DialogControls.push(
                <EditWidgetColorControl key={0} widget={widget} controlId={'border_color'} label={'Border color'} handleChange={(e) => handleChange(e)} />,
                <EditWidgetColorControl key={1} widget={widget} controlId={'background_color'} label={'Background color'} handleChange={e => handleChange(e)} />
            );
            break;
        case 'Label':
            DialogControls.push(
                <EditWidgetTextControl key={0} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
                <EditWidgetTextSizeControl key={1} widget={widget} handleChange={e => handleChange(e)} />,
                <EditWidgetColorControl key={2} widget={widget} controlId={'fontColor'} label={'Text color'} handleChange={e => handleChange(e)} />
            );
            break;
        case 'HTML':
            DialogControls.push(
                <EditWidgetHTMLContent key={0} widget={widget} placeholder='HTML Code' controlId='content' handleChange={e => handleChange(e)} />
            );
            break;
        case 'Topology':
            // Restrict to only xml files (MIME)
            let topologyControlFiles = files == null? [] : files.filter( file => file.type.includes('xml'));
            DialogControls.push(
                <EditImageWidgetControl key={0} sessionToken={sessionToken} widget={widget} files={topologyControlFiles} handleChange={(e) => handleChange(e)} />
            );
            break;

        case 'Input':
            DialogControls.push(
                <EditWidgetTextControl key={0} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
                <EditWidgetSignalControl key={2} widget={widget} input  signals={signals} handleChange={(e) => handleChange(e)} />
            );
            break;

        default:
            console.log('Non-valid widget type: ' + widgetType);
        }

    return DialogControls;
}
