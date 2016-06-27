import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    projects: { serialize: 'ids' }
  }
});
