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
import EditWidgetSamplesControl from './edit-widget-samples-control';
import EditFileWidgetControl from './edit-widget-file-control';
import EditWidgetSignalControl from './edit-widget-signal-control';
import EditWidgetSignalsControl from './edit-widget-signals-control';
import EditWidgetOrientation from './edit-widget-orientation';
import EditWidgetAspectControl from './edit-widget-aspect-control';
import EditWidgetTextSizeControl from './edit-widget-text-size-control';
import EditWidgetCheckboxControl from './edit-widget-checkbox-control';
import EditWidgetCheckboxList from './edit-widget-checkbox-list';
import EditWidgetColorZonesControl from './edit-widget-color-zones-control';
import EditWidgetMinMaxControl from './edit-widget-min-max-control';
import EditWidgetParametersControl from './edit-widget-parameters-control';
import EditWidgetICSelect from './edit-widget-ic-select';
import EditWidgetConfigSelect from './edit-widget-config-select';
import EditWidgetPlotColorsControl from './edit-widget-plot-colors-control';
import EditWidgetPlotModeControl from './edit-widget-plot-mode-control';
import EditWidgetRotationControl from './edit-widget-rotation-control';
//import EditWidgetHTMLContent from './edit-widget-html-content';

export default function CreateControls(widgetType = null, widget = null, sessionToken = null, files = null,ics = null, configs = null, signals, handleChange) {
    // Use a list to concatenate the controls according to the widget type
    var DialogControls = [];

    let topStyle={marginBottom: '10px'}

    let bottomStyle={marginTop: '10px'}

    let midStyle={
        marginTop: '10px',
        marginBottom: '10px'
    }

    switch(widgetType) {
        case 'CustomAction':
            DialogControls.push(
              <EditWidgetTextControl key={0} style={topStyle} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
              <EditWidgetTextControl key={1} style={midStyle} widget={widget} controlId={'customProperties.icon'} label={'Icon'} placeholder={'Enter an awesome font icon name'} handleChange={e => handleChange(e)} />,
              <EditWidgetParametersControl key={2} style={bottomStyle} widget={widget} controlId={'customProperties.actions'} label={'Actions'} handleChange={(e) => handleChange(e)} />
            );
            break;
        case 'Action':
            DialogControls.push(
              <EditWidgetSignalControl key={0} widget={widget} controlId={'signalIDs'} signals={signals} handleChange={(e) => handleChange(e)} direction={'in'} />,
            );
            break;
        case 'Value':
            DialogControls.push(
                <EditWidgetTextControl key={0} style={topStyle} widget={widget} controlId={'name'} label={'Signal name'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
                <EditWidgetSignalControl key={1} style={midStyle} widget={widget} controlId={'signalIDs'} signals={signals} handleChange={(e) => handleChange(e)} direction={'out'}/>,
                <EditWidgetTextSizeControl key={2} style={midStyle} widget={widget} handleChange={e => handleChange(e)} />,
                <EditWidgetCheckboxControl key={3} style={midStyle} widget={widget} controlId={'customProperties.showUnit'} input text="Show unit" handleChange={e => handleChange(e)} />,
                <EditWidgetCheckboxControl key={4} style={bottomStyle} widget={widget} controlId={'customProperties.showScalingFactor'} input text="Show scaling factor" handleChange={e => handleChange(e)} />
            );
            break;
        case 'Lamp':
              DialogControls.push(
                <EditWidgetSignalControl key={0} style={topStyle} widget={widget} controlId={'signalIDs'} signals={signals} handleChange={(e) => handleChange(e)} direction={'out'}/>,
                <EditWidgetTextControl key={1} style={midStyle} widget={widget} controlId={'customProperties.threshold'} label={'Threshold'} placeholder={'0.5'} handleChange={e => handleChange(e)} />,
                <EditWidgetColorControl key={2} style={midStyle} widget={widget} controlId={'customProperties.on_color'} label={'Color On'} handleChange={(e) => handleChange(e)} disableOpacity={false}/>,
                <EditWidgetColorControl key={3} style={bottomStyle} widget={widget} controlId={'customProperties.off_color'} label={'Color Off'} handleChange={(e) => handleChange(e)} disableOpacity={false}/>,
              );
              break;
        case 'Plot':
            DialogControls.push(
                <EditWidgetPlotModeControl key={0} style={topStyle} widget={widget} controlId={'customProperties.mode'} input handleChange={e => handleChange(e)} />,
                <EditWidgetSamplesControl key={1} style={midStyle} widget={widget} timeId={'customProperties.time'} nbrId={'customProperties.nbrSamples'} handleChange={(e) => handleChange(e)} />,
                <EditWidgetSignalsControl key={2} style={midStyle} widget={widget} controlId={'signalIDs'}  signals={signals} handleChange={(e) => handleChange(e)} direction={'out'}/>,
                <EditWidgetPlotColorsControl key={3} style={midStyle} widget={widget} controlId={'customProperties.lineColors'} signals={signals} handleChange={(e) => handleChange(e)} />,
                <EditWidgetTextControl key={4} style={midStyle} widget={widget} controlId={'customProperties.ylabel'} label={'Y-Axis name'} placeholder={'Enter a name for the y-axis'}  handleChange={(e) => handleChange(e)} />,
                <EditWidgetCheckboxControl key={5} style={midStyle} widget={widget} controlId={'customProperties.showUnit'} input text="Show unit" handleChange={e => handleChange(e)} />,
                <EditWidgetMinMaxControl key={6} style={bottomStyle} widget={widget} controlId="customProperties.y" handleChange={e => handleChange(e)} />
            );
            break;
        case 'Table':
            DialogControls.push(
                <EditWidgetSignalsControl key={0} style={topStyle} widget={widget} controlId={'signalIDs'}  signals={signals} handleChange={(e) => handleChange(e)} direction={'out'}/>,
                <EditWidgetCheckboxControl key={1} style={midStyle} widget={widget} controlId={'customProperties.showUnit'} input text="Show unit" handleChange={e => handleChange(e)} />,
                <EditWidgetCheckboxControl key={2} style={bottomStyle} widget={widget} controlId={'customProperties.showScalingFactor'} input text="Show scaling factor" handleChange={e => handleChange(e)} />
            );
            break;
        case 'Image':
            // Restrict to only image file types (MIME)
            //let imageControlFiles = files == null? [] : files.filter(file => file.type.includes('image'));
            DialogControls.push(
                <EditFileWidgetControl key={0} style={topStyle} widget={widget} controlId={"customProperties.file"} files={files} type={'image'} handleChange={(e) => handleChange(e)} />,
                <EditWidgetAspectControl key={1} style={bottomStyle} widget={widget} controlId={"customProperties.lockAspect"} handleChange={e => handleChange(e)} />
            );
            break;
        case 'Gauge':
            DialogControls.push(
                <EditWidgetTextControl key={0} style={topStyle} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
                <EditWidgetSignalControl key={1} style={midStyle} widget={widget} controlId={'signalIDs'} signals={signals} handleChange={(e) => handleChange(e)} direction={'out'}/>,
                <EditWidgetCheckboxControl key={2} style={midStyle} widget={widget} controlId="customProperties.colorZones" input text="Show color zones" handleChange={e => handleChange(e)} />,
                <EditWidgetColorZonesControl key={3} style={midStyle} widget={widget} controlId="customProperties.zones" handleChange={e => handleChange(e)} disableOpacity={true}/>,
                <EditWidgetMinMaxControl key={4} style={midStyle} widget={widget} controlId="customProperties.value" handleChange={e => handleChange(e)} />,
                <EditWidgetCheckboxControl key={5} style={bottomStyle} widget={widget} controlId={'customProperties.showScalingFactor'} input text="Show scaling factor" handleChange={e => handleChange(e)} />
            );
            break;
        case 'Slider':
            DialogControls.push(
                <EditWidgetTextControl key={0} style={topStyle} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
                <EditWidgetOrientation key={1} style={midStyle} widget={widget} handleChange={(e) => handleChange(e)} />,
                <EditWidgetSignalControl key={2} style={midStyle} widget={widget} controlId={'signalIDs'} input signals={signals} handleChange={(e) => handleChange(e)} direction={'in'}/>,
                <EditWidgetCheckboxControl key={3} style={midStyle} widget={widget} controlId={'customProperties.continous_update'} input text={'Continous Update'} handleChange={(e) => handleChange(e)} />,
                <EditWidgetCheckboxControl key={4} style={midStyle} widget={widget} controlId={'customProperties.showUnit'} input text="Show unit" handleChange={e => handleChange(e)} />,
                <EditWidgetMinMaxControl key={5} style={midStyle} widget={widget} controlId={'customProperties.range'} handleChange={e => handleChange(e)} />,
                <EditWidgetNumberControl key={6} style={midStyle} widget={widget} controlId={'customProperties.step'} label={'Step Size'} defaultValue={0.1} handleChange={(e) => handleChange(e)} />,
            );
            break;
        case 'Button':
            DialogControls.push(
                <EditWidgetTextControl key={0} style={topStyle} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
                <EditWidgetSignalControl key={1} style={midStyle} widget={widget} controlId={'signalIDs'} input signals={signals} handleChange={(e) => handleChange(e)} direction={'in'}/>,
                <EditWidgetCheckboxControl key={2} style={midStyle} widget={widget} controlId={'customProperties.toggle'} input text="Toggle" handleChange={e => handleChange(e)} />,
                <EditWidgetNumberControl key={3} style={midStyle} widget={widget} controlId={'customProperties.on_value'} label={'On Value'} defaultValue={1} handleChange={(e) => handleChange(e)} />,
                <EditWidgetNumberControl key={4} style={midStyle} widget={widget} controlId={'customProperties.off_value'} label={'Off Value'} defaultValue={0} handleChange={(e) => handleChange(e)} />,
                <EditWidgetColorControl key={5} style={midStyle} widget={widget} controlId={'customProperties.background_color'} label={'Background Color and Opacity'} handleChange={(e) => handleChange(e)} disableOpacity={false}/>,
                <EditWidgetColorControl key={6} style={midStyle} widget={widget} controlId={'customProperties.border_color'} label={'Border Color'} handleChange={(e) => handleChange(e)} disableOpacity={true}/>,
                <EditWidgetColorControl key={7} style={bottomStyle} widget={widget} controlId={'customProperties.font_color'} label={'Font Color'} handleChange={(e) => handleChange(e)} disableOpacity={true}/>,
            );
            break;
        case 'Box':
            DialogControls.push(
                <EditWidgetColorControl key={0} style={topStyle} widget={widget} controlId={'customProperties.background_color'} label={'Background Color and Opacity'} handleChange={e => handleChange(e)} disableOpacity={false}/>,
                <EditWidgetColorControl key={1} style={midStyle} widget={widget} controlId={'customProperties.border_color'} label={'Border Color'} handleChange={(e) => handleChange(e)} disableOpacity={true}/>,
                <EditWidgetNumberControl key={2} style={bottomStyle} widget={widget} controlId={'customProperties.border_width'} label={'Border width'} defaultValue={0} handleChange={(e) => handleChange(e)} />
            );
            break;
        case 'Label':
            DialogControls.push(
                <EditWidgetTextControl key={0} style={topStyle} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
                <EditWidgetTextSizeControl key={1} style={midStyle} widget={widget} handleChange={e => handleChange(e)} />,
                <EditWidgetColorControl key={2} style={bottomStyle} widget={widget} controlId={'customProperties.fontColor'} label={'Text color'} handleChange={e => handleChange(e)} disableOpacity={false}/>
            );
            break;
        /*case 'HTML':
            DialogControls.push(
                <EditWidgetHTMLContent key={0} widget={widget} controlId={'customProperties.content'} placeholder='HTML Code'  handleChange={e => handleChange(e)} />
            );
            break; */
        case 'Topology':
            // Restrict to only xml files (MIME)
            //let topologyControlFiles = files == null? [] : files.filter( file => file.type.includes('xml'));
            DialogControls.push(
                <EditFileWidgetControl key={0} widget={widget} controlId={"customProperties.file"} files={files} type={'xml'} handleChange={(e) => handleChange(e) } />
            );
            break;
        case 'NumberInput':
            DialogControls.push(
                <EditWidgetTextControl key={0} style={topStyle} widget={widget} controlId={'name'} label={'Text'} placeholder={'Enter text'} handleChange={e => handleChange(e)} />,
                <EditWidgetSignalControl key={1} style={midStyle} widget={widget} controlId={'signalIDs'} input  signals={signals} handleChange={(e) => handleChange(e)} direction={'in'}/>,
                <EditWidgetCheckboxControl key={2} style={bottomStyle} widget={widget} controlId={'customProperties.showUnit'} input text="Show unit" handleChange={e => handleChange(e)} />
            );
            break;
        case 'Line':
            DialogControls.push(
                <EditWidgetColorControl key={0} style={topStyle} widget={widget} controlId={'customProperties.border_color'} label={'Line color'} handleChange={(e) => handleChange(e)} disableOpacity={false}/>,
                <EditWidgetRotationControl key={1} style={midStyle} widget={widget} controlId={'customProperties.rotation'} label={'Rotation (degrees)'} defaultValue={0} handleChange={(e) => handleChange(e)} />,
                <EditWidgetNumberControl key={2} style={bottomStyle} widget={widget} controlId={'customProperties.border_width'} label={'Line width'} defaultValue={0} handleChange={(e) => handleChange(e)} />
            );
            break;

        case 'TimeOffset':
            DialogControls.push(
                <EditWidgetICSelect key={0} style={topStyle} widget={widget} controlId={'customProperties.icID'} input ics={ics} handleChange={(e) => handleChange(e)}/>,
                <EditWidgetNumberControl key={1} style={midStyle} widget={widget} controlId={'customProperties.threshold_yellow'} label={'Threshold yellow'} defaultValue={0} handleChange={(e) => handleChange(e)} />,
                <EditWidgetNumberControl key={2} style={midStyle} widget={widget} controlId={'customProperties.threshold_red'} label={'Threshold red'} defaultValue={0} handleChange={(e) => handleChange(e)} />,
                <EditWidgetCheckboxControl key={3} style={midStyle} widget={widget} controlId={'customProperties.horizontal'} input text="Horizontal" handleChange={e => handleChange(e)} />,
                <EditWidgetCheckboxControl key={4} style={midStyle} widget={widget} controlId={'customProperties.showName'} input text="showName" handleChange={e => handleChange(e)} />,
                <EditWidgetCheckboxControl key={5} style={bottomStyle} widget={widget} controlId={'customProperties.showOffset'} input text="showOffset" handleChange={e => handleChange(e)} />,
            );
            break;

        case 'Player':
            DialogControls.push(
                <EditWidgetConfigSelect key={0} style={topStyle} widget={widget} controlId={'customProperties.configID'} input configs={configs} handleChange={(e) => handleChange(e)}/>,
                <EditWidgetCheckboxControl key={1} style={midStyle} widget={widget} controlId={'customProperties.uploadResults'} input text='Upload Results' handleChange={e => handleChange(e)}/>,
            );
            break;

        case 'ICstatus':
          DialogControls.push(
              <EditWidgetCheckboxList key={0} style={midStyle} widget={widget} controlId={'customProperties.checkedIDs'} input label='Select ICs to show' list={ics} handleChange={e => handleChange(e)}/>
          );
          break;

        default:
            console.log('Non-valid widget type: ' + widgetType);
        }

    return DialogControls;
}
