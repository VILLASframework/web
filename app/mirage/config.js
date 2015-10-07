export default function() {
	this.namespace =  '/api/ngsi10';

	this.post('/queryContext', function(db, request) {
		return {
			contextResponses:	db.entities.map(attrs => ({
				contextElement: {
					type: attrs.type,
					isPattern: false,
					id: attrs.name,
					attributes: attrs.properties.map(props => ({
						name: props.name,
						type: props.type,
						value: props.value,
						metadatas: [
							{
								name: 'timestamp',
								type: 'date',
								value: props.timestamp
							}
						]
					}))
				},
				statusCode: {
					code: 200,
					reasonPhrase: 'OK'
				}
			}))
		};
	});
}

/*
You can optionally export a config that is only loaded during tests
export function testConfig() {

}
*/
