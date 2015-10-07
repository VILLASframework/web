import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(i) { return `S${i + 1}_ElectricalGrid`; },

  type: 'ElectricalGridMonitoring',

  properties: function(i) {
    var data = [];

    data.push({name: 'Current', value: faker.finance.amount(-100, 100, 4), type: 'A', timestamp: faker.date.past()});
    data.push({name: 'Voltage', value: faker.finance.amount(-100, 100, 4), type: 'kV', timestamp: faker.date.past()});
    data.push({name: 'Power', value: faker.finance.amount(-100, 100, 4), type: 'MW', timestamp: faker.date.past()});

    return data;
  }
});
