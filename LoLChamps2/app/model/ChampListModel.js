Ext.define('LoLChamps.model.ChampListModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
		    {
				name: 'id',
				type: 'int'
			}, {
				name: 'title'
			}, {
				name: 'name'
			}, {
				name: 'key'
			}, {
				name: 'info'
			}, {
				name: 'version'
			}
		]
	}
});