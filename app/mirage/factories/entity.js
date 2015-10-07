import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(i) { return `S${i + 1}_ElectricalGrid`; },

  type: 'ElectricalGridMonitoring',

  properties: function(i) {
    var data = [];

    for (var j = 0; j < 10; j++) {
      data.push({
        name: faker.random.arrayElement(['Current', 'Max. Current', 'Voltage', 'Max. Voltage', 'Power', 'Max. Power']),
        value: faker.finance.amount(-100, 100, 4),
        type: faker.random.arrayElement(['A', 'kV', 'MW']),
        timestamp: faker.date.past()
      })
    }

    return data;
  }
});
