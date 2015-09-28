import Mirage, {faker} from 'ember-cli-mirage'

export default Mirage.Factory.extend({
  name(i) { return `Property ${i}`; },
  value: faker.list.random(1.23, 2.34, 3.45, 4.56),
  unit: faker.list.random('A', 'kV', 'MW')
});
