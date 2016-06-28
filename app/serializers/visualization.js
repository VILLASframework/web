import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    project: { serialize: 'ids' },
    plots: { serialize: 'ids' }
  }
});
