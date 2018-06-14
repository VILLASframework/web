
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
import EditWidgetMinMaxControl from '../../../components/dialog/edit-widget-min-max-control';
import EditWidgetColorZonesControl from '../../../components/dialog/edit-widget-color-zones-control';
import EditWidgetHTMLContent from '../../../components/dialog/edit-widget-html-content';
import EditWidgetNumberControl from '../../../components/dialog/edit-widget-number-control';

describe('edit widget control creator', () => {
    it('should not return null', () => {
        let controls = createControls('Value', null, null, null, null, null, null);
        expect(controls).to.be.not.undefined;
    });

    var runs = [
        { args: { widgetType: 'Lamp' }, result: { controlNumber: 5, controlTypes: [EditWidgetSimulatorControl, EditWidgetSignalControl, EditWidgetTextControl, EditWidgetColorControl, EditWidgetColorControl] } },
        { args: { widgetType: 'Value' }, result: { controlNumber: 5, controlTypes: [EditWidgetTextControl, EditWidgetSimulatorControl, EditWidgetSignalControl, EditWidgetTextSizeControl, EditWidgetCheckboxControl] } },
        { args: { widgetType: 'Plot' }, result: { controlNumber: 5, controlTypes: [EditWidgetTimeControl, EditWidgetSimulatorControl, EditWidgetSignalsControl, EditWidgetTextControl, EditWidgetMinMaxControl] } },
        { args: { widgetType: 'Table' }, result: { controlNumber: 1, controlTypes: [EditWidgetSimulatorControl] } },
        { args: { widgetType: 'Image' }, result: { controlNumber: 2, controlTypes: [EditImageWidgetControl, EditWidgetAspectControl] } },
        { args: { widgetType: 'Gauge' }, result: { controlNumber: 6, controlTypes: [EditWidgetTextControl, EditWidgetSimulatorControl, EditWidgetSignalControl, EditWidgetCheckboxControl, EditWidgetColorZonesControl, EditWidgetMinMaxControl] } },
        { args: { widgetType: 'PlotTable' }, result: { controlNumber: 5, controlTypes: [EditWidgetSimulatorControl, EditWidgetSignalsControl, EditWidgetTextControl, EditWidgetTimeControl, EditWidgetMinMaxControl] } },
        { args: { widgetType: 'Slider' }, result: { controlNumber: 9, controlTypes: [EditWidgetTextControl, EditWidgetOrientation, EditWidgetSimulatorControl, EditWidgetSignalControl, EditWidgetCheckboxControl, EditWidgetCheckboxControl, EditWidgetMinMaxControl, EditWidgetNumberControl, EditWidgetNumberControl] } },
        { args: { widgetType: 'Button' }, result: { controlNumber: 4, controlTypes: [EditWidgetColorControl, EditWidgetSimulatorControl, EditWidgetSignalControl] } },
        { args: { widgetType: 'Box' }, result: { controlNumber: 2, controlTypes: [EditWidgetColorControl, EditWidgetColorControl] } },
        { args: { widgetType: 'Label' }, result: { controlNumber: 3, controlTypes: [EditWidgetTextControl, EditWidgetTextSizeControl, EditWidgetColorControl] } },
        { args: { widgetType: 'HTML' }, result: { controlNumber: 1, controlTypes: [EditWidgetHTMLContent] } },
        { args: { widgetType: 'Input'}, result: { controlNumber: 3, controlTypes: [EditWidgetTextControl, EditWidgetSimulatorControl, EditWidgetSignalControl] } }
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
