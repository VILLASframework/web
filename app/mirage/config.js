export default function() {
	this.get('/properties', function(db, request) {
		return {
			data: db.properties.map(attrs => ({ type: 'properties', id: attrs.id, attributes: attrs }))
		}
	});
}

/*
You can optionally export a config that is only loaded during tests
export function testConfig() {

}
*/
