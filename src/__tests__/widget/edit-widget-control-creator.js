
import { expect } from 'chai';

import createControls from '../widget/edit-widget-control-creator';
import EditWidgetTextControl from '../widget/edit-widget-text-control';
import EditWidgetColorControl from '../widget/edit-widget-color-control';
import EditWidgetTimeControl from '../widget/edit-widget-time-control';
import EditImageWidgetControl from '../widget/edit-widget-image-control';
import EditWidgetSimulationControl from '../widget/edit-widget-simulation-control';
import EditWidgetSignalControl from '../widget/edit-widget-signal-control';
import EditWidgetSignalsControl from '../widget/edit-widget-signals-control';
import EditWidgetOrientation from '../widget/edit-widget-orientation';
import EditWidgetTextSizeControl from '../widget/edit-widget-text-size-control';
import EditWidgetAspectControl from '../widget/edit-widget-aspect-control';
import EditWidgetCheckboxControl from '../widget/edit-widget-checkbox-control';
import EditWidgetMinMaxControl from '../widget/edit-widget-min-max-control';
import EditWidgetColorZonesControl from '../widget/edit-widget-color-zones-control';
import EditWidgetHTMLContent from '../widget/edit-widget-html-content';
import EditWidgetNumberControl from '../widget/edit-widget-number-control';

describe('edit widget control creator', () => {
    it('should not return null', () => {
        let controls = createControls('Value', null, null, null, null, null, null);
        expect(controls).to.be.not.undefined;
    });

    var runs = [
        { args: { widgetType: 'Lamp' }, result: { controlNumber: 5, controlTypes: [EditWidgetSimulationControl, EditWidgetSignalControl, EditWidgetTextControl, EditWidgetColorControl, EditWidgetColorControl] } },
        { args: { widgetType: 'Value' }, result: { controlNumber: 5, controlTypes: [EditWidgetTextControl, EditWidgetSimulationControl, EditWidgetSignalControl, EditWidgetTextSizeControl, EditWidgetCheckboxControl] } },
        { args: { widgetType: 'Plot' }, result: { controlNumber: 5, controlTypes: [EditWidgetTimeControl, EditWidgetSimulationControl, EditWidgetSignalsControl, EditWidgetTextControl, EditWidgetMinMaxControl] } },
        { args: { widgetType: 'Table' }, result: { controlNumber: 2, controlTypes: [EditWidgetSimulationControl, EditWidgetCheckboxControl] } },
        { args: { widgetType: 'Image' }, result: { controlNumber: 2, controlTypes: [EditImageWidgetControl, EditWidgetAspectControl] } },
        { args: { widgetType: 'Gauge' }, result: { controlNumber: 6, controlTypes: [EditWidgetTextControl, EditWidgetSimulationControl, EditWidgetSignalControl, EditWidgetCheckboxControl, EditWidgetColorZonesControl, EditWidgetMinMaxControl] } },
        { args: { widgetType: 'PlotTable' }, result: { controlNumber: 5, controlTypes: [EditWidgetSimulationControl, EditWidgetSignalsControl, EditWidgetTextControl, EditWidgetTimeControl, EditWidgetMinMaxControl] } },
        { args: { widgetType: 'Slider' }, result: { controlNumber: 9, controlTypes: [EditWidgetTextControl, EditWidgetOrientation, EditWidgetSimulationControl, EditWidgetSignalControl, EditWidgetCheckboxControl, EditWidgetCheckboxControl, EditWidgetMinMaxControl, EditWidgetNumberControl, EditWidgetNumberControl] } },
        { args: { widgetType: 'Button' }, result: { controlNumber: 6, controlTypes: [EditWidgetTextControl, EditWidgetSimulationControl, EditWidgetSignalControl, EditWidgetCheckboxControl, EditWidgetNumberControl, EditWidgetNumberControl] } },
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
