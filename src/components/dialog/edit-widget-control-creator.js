/**
 * File: edit-widget-control-creator.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 23.05.2017
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
 **********************************************************************************/

import React from 'react';

import EditWidgetTextControl from './edit-widget-text-control';
import EditWidgetColorControl from './edit-widget-color-control';
import EditWidgetTimeControl from './edit-widget-time-control';
import EditImageWidgetControl from './edit-widget-image-control';
import EditWidgetSimulatorControl from './edit-widget-simulator-control';
import EditWidgetSignalControl from './edit-widget-signal-control';
import EditWidgetSignalsControl from './edit-widget-signals-control';
import EditWidgetOrientation from './edit-widget-orientation';
import EditWidgetAspectControl from './edit-widget-aspect-control';
import EditWidgetTextSizeControl from './edit-widget-text-size-control';
import EditWidgetCheckboxControl from './edit-widget-checkbox-control';
import EditWidgetColorZonesControl from './edit-widget-color-zones-control';
import EditWidgetMinMaxControl from './edit-widget-min-max-control';
import EditWidgetHTMLContent from './edit-widget-html-content';

export default function createControls(widgetType = null, widget = null, sessionToken = null, files = null, validateForm, simulation, handleChange) {
    // Use a list to concatenate the controls according to the widget type
    var dialogControls = [];

    switch(widgetType) {
        case 'Value':
            let valueBoundOnChange = (e) => {
                handleChange([e, {target: {id: 'signal', value: 0}}]);
            }
            dialogControls.push(
                <EditWidgetTextControl key={0} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} validate={id => validateForm(id)} handleChange={e => handleChange(e)} />,
                <EditWidgetSimulatorControl key={1} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => valueBoundOnChange(e)} />,
                <EditWidgetSignalControl key={2} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />,
                <EditWidgetTextSizeControl key={3} widget={widget} handleChange={e => handleChange(e)} />,
                <EditWidgetCheckboxControl key={4} widget={widget} controlId={'showUnit'} text="Show unit" handleChange={e => handleChange(e)} />
            );
            break;
        case 'Lamp':
              let lampBoundOnChange = (e) => {
                  handleChange([e, {target: {id: 'signal', value: 0}}]);
              }
              dialogControls.push(
                <EditWidgetSimulatorControl key={0} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => lampBoundOnChange(e)} />,
                <EditWidgetSignalControl key={1} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />,
                <EditWidgetTextControl key={2} widget={widget} controlId={'threshold'} label={'Threshold'} placeholder={'0.5'} validate={id => validateForm(id)} handleChange={e => handleChange(e)} />,
                <EditWidgetColorControl key={3} widget={widget} controlId={'on_color'} label={'Color On'} validate={(id) => validateForm(id)} handleChange={(e) => handleChange(e)} />,
                <EditWidgetColorControl key={4} widget={widget} controlId={'off_color'} label={'Color Off'} validate={(id) => validateForm(id)} handleChange={(e) => handleChange(e)} />,
              );
              break;
        case 'Plot':
            let plotBoundOnChange = (e) => {
                handleChange([e, {target: {id: 'signals', value: []}}]);
            }
            dialogControls.push(
                <EditWidgetTimeControl key={0} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />,
                <EditWidgetSimulatorControl key={1} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => plotBoundOnChange(e)} />,
                <EditWidgetSignalsControl key={2} controlId={'signals'} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />,
                <EditWidgetTextControl key={3} controlId={'ylabel'} label={'Y-Axis name'} placeholder={'Enter a name for the y-axis'} widget={widget} handleChange={(e) => handleChange(e)} />,
                <EditWidgetMinMaxControl key={4} widget={widget} controlId="y" handleChange={e => handleChange(e)} />
            );
            break;
        case 'Table':
            dialogControls.push(
                <EditWidgetSimulatorControl key={0} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />
            );
            break;
        case 'Image':
            // Restrict to only image file types (MIME)
            let imageControlFiles = files == null? [] : files.filter(file => file.type.includes('image'));
            dialogControls.push(
                <EditImageWidgetControl key={0} sessionToken={sessionToken} widget={widget} files={imageControlFiles} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />,
                <EditWidgetAspectControl key={1} widget={widget} handleChange={e => handleChange(e)} />
            );
            break;
        case 'Gauge':
            let gaugeBoundOnChange = (e) => {
                handleChange([e, {target: {id: 'signal', value: ''}}]);
            }
            dialogControls.push(
                <EditWidgetTextControl key={0} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} validate={id => validateForm(id)} handleChange={e => handleChange(e)} />,
                <EditWidgetSimulatorControl key={1} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => gaugeBoundOnChange(e) } />,
                <EditWidgetSignalControl key={2} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />,
                <EditWidgetCheckboxControl key={3} widget={widget} controlId="colorZones" text="Show color zones" handleChange={e => handleChange(e)} />,
                <EditWidgetColorZonesControl key={4} widget={widget} handleChange={e => handleChange(e)} />,
                <EditWidgetMinMaxControl key={5} widget={widget} controlId="value" handleChange={e => handleChange(e)} />
            );
            break;
        case 'PlotTable':
            let plotTableBoundOnChange = (e) => {
                handleChange([e, {target: {id: 'preselectedSignals', value: []}}]);
            }
            dialogControls.push(
                <EditWidgetSimulatorControl key={0} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => plotTableBoundOnChange(e)} />,
                <EditWidgetSignalsControl key={1} controlId={'preselectedSignals'} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />,
                <EditWidgetTextControl key={2} controlId={'ylabel'} label={'Y-Axis'} placeholder={'Enter a name for the Y-axis'} widget={widget} handleChange={(e) => handleChange(e)} />,
                <EditWidgetTimeControl key={3} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />,
                <EditWidgetMinMaxControl key={4} widget={widget} controlId="y" handleChange={e => handleChange(e)} />
            );
            break;
        case 'Slider':
            dialogControls.push(
                <EditWidgetOrientation key={0} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />
            );
            break;
        case 'Button':
            dialogControls.push(
                <EditWidgetColorControl key={0} widget={widget} controlId={'background_color'} label={'Background'} validate={(id) => validateForm(id)} handleChange={(e) => handleChange(e)} />,
                <EditWidgetColorControl key={1} widget={widget} controlId={'font_color'} label={'Font color'} validate={(id) => validateForm(id)} handleChange={(e) => handleChange(e)} />
            );
            break;
        case 'Box':
            dialogControls.push(
                <EditWidgetColorControl key={0} widget={widget} controlId={'border_color'} label={'Border color'} validate={(id) => validateForm(id)} handleChange={(e) => handleChange(e)} />
            );
            break;
        case 'Label':
            dialogControls.push(
                <EditWidgetTextControl key={0} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} validate={id => validateForm(id)} />,
                <EditWidgetTextSizeControl key={1} widget={widget} handleChange={e => handleChange(e)} />,
                <EditWidgetColorControl key={2} widget={widget} controlId={'fontColor'} label={'Text color'} handleChange={e => handleChange(e)} />
            );
            break;
        case 'HTML':
            dialogControls.push(
                <EditWidgetHTMLContent key={0} widget={widget} placeholder='HTML Code' controlId='content' handleChange={e => handleChange(e)} />
            );
            break;
        case 'Topology':
            // Restrict to only xml files (MIME)
            let topologyControlFiles = files == null? [] : files.filter( file => file.type.includes('xml'));
            dialogControls.push(
                <EditImageWidgetControl key={0} sessionToken={sessionToken} widget={widget} files={topologyControlFiles} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />
            );
            break;

        default:
            console.log('Non-valid widget type: ' + widgetType);
        }

    return dialogControls;
}
