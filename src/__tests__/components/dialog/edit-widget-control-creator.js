
import { expect } from 'chai';

import createControls from '../../../components/dialogs/edit-widget-control-creator';
import EditWidgetTextControl from '../../../components/dialogs/edit-widget-text-control';
import EditWidgetColorControl from '../../../components/dialogs/edit-widget-color-control';
import EditWidgetTimeControl from '../../../components/dialogs/edit-widget-time-control';
import EditImageWidgetControl from '../../../components/dialogs/edit-widget-image-control';
import EditWidgetSimulationControl from '../../../components/dialogs/edit-widget-simulation-control';
import EditWidgetSignalControl from '../../../components/dialogs/edit-widget-signal-control';
import EditWidgetSignalsControl from '../../../components/dialogs/edit-widget-signals-control';
import EditWidgetOrientation from '../../../components/dialogs/edit-widget-orientation';
import EditWidgetTextSizeControl from '../../../components/dialogs/edit-widget-text-size-control';
import EditWidgetAspectControl from '../../../components/dialogs/edit-widget-aspect-control';
import EditWidgetCheckboxControl from '../../../components/dialogs/edit-widget-checkbox-control';
import EditWidgetMinMaxControl from '../../../components/dialogs/edit-widget-min-max-control';
import EditWidgetColorZonesControl from '../../../components/dialogs/edit-widget-color-zones-control';
import EditWidgetHTMLContent from '../../../components/dialogs/edit-widget-html-content';
import EditWidgetNumberControl from '../../../components/dialogs/edit-widget-number-control';

describe('edit widget control creator', () => {
    it('should not return null', () => {
        let controls = createControls('Value', null, null, null, null, null, null);
        expect(controls).to.be.not.undefined;
    });

    var runs = [
        { args: { widgetType: 'Lamp' }, result: { controlNumber: 5, controlTypes: [EditWidgetSimulationControl, EditWidgetSignalControl, EditWidgetTextControl, EditWidgetColorControl, EditWidgetColorControl] } },
        { args: { widgetType: 'Value' }, result: { controlNumber: 5, controlTypes: [EditWidgetTextControl, EditWidgetSimulationControl, EditWidgetSignalControl, EditWidgetTextSizeControl, EditWidgetCheckboxControl] } },
        { args: { widgetType: 'Plot' }, result: { controlNumber: 5, controlTypes: [EditWidgetTimeControl, EditWidgetSimulationControl, EditWidgetSignalsControl, EditWidgetTextControl, EditWidgetMinMaxControl] } },
        { args: { widgetType: 'Table' }, result: { controlNumber: 1, controlTypes: [EditWidgetSimulationControl] } },
        { args: { widgetType: 'Image' }, result: { controlNumber: 2, controlTypes: [EditImageWidgetControl, EditWidgetAspectControl] } },
        { args: { widgetType: 'Gauge' }, result: { controlNumber: 6, controlTypes: [EditWidgetTextControl, EditWidgetSimulationControl, EditWidgetSignalControl, EditWidgetCheckboxControl, EditWidgetColorZonesControl, EditWidgetMinMaxControl] } },
        { args: { widgetType: 'PlotTable' }, result: { controlNumber: 5, controlTypes: [EditWidgetSimulationControl, EditWidgetSignalsControl, EditWidgetTextControl, EditWidgetTimeControl, EditWidgetMinMaxControl] } },
        { args: { widgetType: 'Slider' }, result: { controlNumber: 9, controlTypes: [EditWidgetTextControl, EditWidgetOrientation, EditWidgetSimulationControl, EditWidgetSignalControl, EditWidgetCheckboxControl, EditWidgetCheckboxControl, EditWidgetMinMaxControl, EditWidgetNumberControl, EditWidgetNumberControl] } },
        { args: { widgetType: 'Button' }, result: { controlNumber: 4, controlTypes: [EditWidgetColorControl, EditWidgetSimulationControl, EditWidgetSignalControl] } },
        { args: { widgetType: 'Box' }, result: { controlNumber: 2, controlTypes: [EditWidgetColorControl, EditWidgetColorControl] } },
        { args: { widgetType: 'Label' }, result: { controlNumber: 3, controlTypes: [EditWidgetTextControl, EditWidgetTextSizeControl, EditWidgetColorControl] } },
        { args: { widgetType: 'HTML' }, result: { controlNumber: 1, controlTypes: [EditWidgetHTMLContent] } },
        { args: { widgetType: 'Input'}, result: { controlNumber: 3, controlTypes: [EditWidgetTextControl, EditWidgetSimulationControl, EditWidgetSignalControl] } }
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
