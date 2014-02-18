Ext.define('LoLChamps.store.ChampListStore', {
	extend: 'Ext.data.Store',
	id: 'champliststore',
	config: {
		storeId : 'champliststore',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: 'https://prod.api.pvp.net/api/lol/' + LoLChamps.app.REGION + '/v1.1/champion?api_key=' + apiKey,
			model: 'LoLChamps.model.ChampListModel',
			reader: {
				type: 'json',
				rootProperty: 'champions'
			},
			listeners: {
				exception: function(store, response, eOpts) {
					console.warn("ChampListStoreError");
				}
			}
		},
		listeners: {
			beforeload: function(store, response, eOpts) {
				this.getProxy().setUrl('https://prod.api.pvp.net/api/lol/' + LoLChamps.app.REGION + '/v1.1/champion?api_key=' + apiKey);
				Ext.getCmp('champlistview').setMasked({
					xtype: 'loadmask',
					message: 'Retrieving Champion List for ' + LoLChamps.app.REGION.toUpperCase()
				});
			}, 
			load: function(store, records, successful, operation, eOpts) {
				Ext.getCmp('champlistview').setMasked(false);
			}
		}
	}
});