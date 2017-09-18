
import { expect } from 'chai';

import createControls from '../../../components/dialog/edit-widget-control-creator';
import EditWidgetTextControl from '../../../components/dialog/edit-widget-text-control';
import EditWidgetColorControl from '../../../components/dialog/edit-widget-color-control';
import EditWidgetTimeControl from '../../../components/dialog/edit-widget-time-control';
import EditImageWidgetControl from '../../../components/dialog/edit-widget-image-control';
import EditWidgetSimulatorControl from '../../../components/dialog/edit-widget-simulator-control';
import EditWidgetSignalControl from '../../../components/dialog/edit-widget-signal-control';
import EditWidgetSignalsControl from '../../../components/dialog/edit-widget-signals-control';
import EditWidgetOrientation from '../../../components/dialog/edit-widget-orientation';
import EditWidgetTextSizeControl from '../../../components/dialog/edit-widget-text-size-control';
import EditWidgetAspectControl from '../../../components/dialog/edit-widget-aspect-control';
import EditWidgetCheckboxControl from '../../../components/dialog/edit-widget-checkbox-control';

describe('edit widget control creator', () => {
    it('should not return null', () => {
        let controls = createControls('Value', null, null, null, null, null, null);
        expect(controls).to.be.not.undefined;
    });

    var runs = [
        { args: { widgetType: 'Value' }, result: { controlNumber: 5, controlTypes: [EditWidgetTextControl, EditWidgetSimulatorControl, EditWidgetSignalControl, EditWidgetTextSizeControl, EditWidgetCheckboxControl] } },
        { args: { widgetType: 'Plot' }, result: { controlNumber: 4, controlTypes: [EditWidgetTimeControl, EditWidgetSimulatorControl, EditWidgetSignalsControl, EditWidgetTextControl] } },
        { args: { widgetType: 'Table' }, result: { controlNumber: 1, controlTypes: [EditWidgetSimulatorControl] } },
        { args: { widgetType: 'Image' }, result: { controlNumber: 2, controlTypes: [EditImageWidgetControl, EditWidgetAspectControl] } },
        { args: { widgetType: 'Gauge' }, result: { controlNumber: 3, controlTypes: [EditWidgetTextControl, EditWidgetSimulatorControl, EditWidgetSignalControl] } },
        { args: { widgetType: 'PlotTable' }, result: { controlNumber: 3, controlTypes: [EditWidgetSimulatorControl, EditWidgetSignalsControl, EditWidgetTextControl] } },
        { args: { widgetType: 'Slider' }, result: { controlNumber: 1, controlTypes: [EditWidgetOrientation] } },
        { args: { widgetType: 'Button' }, result: { controlNumber: 2, controlTypes: [EditWidgetColorControl] } },
        { args: { widgetType: 'Box' }, result: { controlNumber: 1, controlTypes: [EditWidgetColorControl] } },
        { args: { widgetType: 'Label' }, result: { controlNumber: 3, controlTypes: [EditWidgetTextControl, EditWidgetTextSizeControl, EditWidgetColorControl] } }
    ];

    runs.forEach( (run) => {
        let itMsg = run.args.widgetType + ' widget edit model should have correct controls';
        it(itMsg, () => {
            let controls = createControls(run.args.widgetType, null, null, null, null, null, null);
            
            expect(controls).to.have.lengthOf(run.result.controlNumber);
            
            controls.forEach( (control) => expect(control.type).to.be.oneOf(run.result.controlTypes))
        });
    });
});