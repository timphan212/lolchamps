Ext.define('LoLChamps.store.ChampListStore', {
	extend: 'Ext.data.Store',
	id: 'champliststore',
	config: {
		storeId : 'champliststore',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: 'https://prod.api.pvp.net/api/lol/na/v1.1/champion?api_key=' + apiKey,
			model: 'LoLChamps.model.ChampListModel',
			reader: {
				type: 'json',
				rootProperty: 'champions'
			}
		}
	}
});