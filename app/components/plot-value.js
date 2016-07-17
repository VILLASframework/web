import Ember from 'ember';
import PlotAbstract from './plot-abstract';

export default PlotAbstract.extend({
  tagName: 'div',
  classNames: [ 'plotContainer', 'plotValue' ],

  minWidth_resize: 50,
  minHeight_resize: 20
});
