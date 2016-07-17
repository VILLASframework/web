import Ember from 'ember';
import PlotAbstract from './plot-abstract';

export default PlotAbstract.extend({
  tagName: 'div',
  classNames: [ 'plotContainer', 'plotTable' ],

  minWidth_resize: 200,
  minHeight_resize: 60
});
