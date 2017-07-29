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

export default function createControls(widgetType = null, widget = null, sessionToken = null, files = null, validateForm, simulation, handleChange) {
    // Use a list to concatenate the controls according to the widget type
    var dialogControls = [];

    switch(widgetType) {
        case 'Value': {
            let valueBoundOnChange = (e) => {
                handleChange([e, {target: {id: 'signal', value: 0}}]);
            }
            dialogControls.push(
                <EditWidgetSimulatorControl key={1} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => valueBoundOnChange(e)} />,
                <EditWidgetSignalControl key={2} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />
            )
        }
        break;
        case 'Plot': {
            let plotBoundOnChange = (e) => {
                handleChange([e, {target: {id: 'signals', value: []}}]);
            }
            dialogControls.push(
                <EditWidgetTimeControl key={1} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />,
                <EditWidgetSimulatorControl key={2} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => plotBoundOnChange(e)} />,
                <EditWidgetSignalsControl key={3} controlId={'signals'} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />,
                <EditWidgetTextControl key={4} controlId={'ylabel'} label={'Y-Axis name'} placeholder={'Enter a name for the y-axis'} widget={widget} handleChange={(e) => handleChange(e)} />)
            }
            break;
        case 'Table': {
            dialogControls.push(
                <EditWidgetSimulatorControl key={1} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />)
            }
            break;
        case 'Image': {
            dialogControls.push(
                <EditImageWidgetControl key={1} sessionToken={sessionToken} widget={widget} files={files} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />,
                <EditWidgetAspectControl key={2} lockAspect={widget.lockAspect} handleChange={e => handleChange(e)} />);
            }
            break;
        case 'Gauge': {
            let gaugeBoundOnChange = (e) => {
                handleChange([e, {target: {id: 'signal', value: ''}}]);
            }
            dialogControls.push(
                <EditWidgetSimulatorControl key={1} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => gaugeBoundOnChange(e) } />,
                <EditWidgetSignalControl key={2} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />)
            }
            break;
        case 'PlotTable': {
            let plotTableBoundOnChange = (e) => {
                handleChange([e, {target: {id: 'preselectedSignals', value: []}}]);
            }
            dialogControls.push(
                <EditWidgetSimulatorControl key={1} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => plotTableBoundOnChange(e)} />,
                <EditWidgetSignalsControl key={2} controlId={'preselectedSignals'} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />,
                <EditWidgetTextControl key={3} controlId={'ylabel'} label={'Y-Axis'} placeholder={'Enter a name for the Y-axis'} widget={widget} handleChange={(e) => handleChange(e)} />)
            }
            break;
        case 'Slider': {
            dialogControls.push(
                <EditWidgetOrientation key={1} widget={widget} validate={(id) => validateForm(id)} simulation={simulation} handleChange={(e) => handleChange(e)} />)
            }
            break;
        case 'Button': {
            dialogControls.push(
                <EditWidgetColorControl key={1} widget={widget} controlId={'background_color'} label={'Background'} validate={(id) => validateForm(id)} handleChange={(e) => handleChange(e)} />,
                <EditWidgetColorControl key={2} widget={widget} controlId={'font_color'} label={'Font color'} validate={(id) => validateForm(id)} handleChange={(e) => handleChange(e)} />)
            }
            break;
        case 'Box': {
            dialogControls.push(
                <EditWidgetColorControl key={1} widget={widget} controlId={'border_color'} label={'Border color'} validate={(id) => validateForm(id)} handleChange={(e) => handleChange(e)} />)
            }
            break;
        default:
            console.log('Non-valid widget type');
        }

    return dialogControls;
}