Ext.define('LoLChamps.store.ChampListStore', {
	extend: 'Ext.data.Store',
	id: 'champliststore',
	config: {
		storeId : 'champliststore',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: '',
			model: 'LoLChamps.model.ChampListModel',
			reader: {
				type: 'champreader',
				rootProperty: 'data'
			},
			listeners: {
				exception: function(store, response, eOpts) {
					console.warn("ChampListStoreError");
				}
			}
		},
		listeners: {
			beforeload: function(store, response, eOpts) {
				this.getProxy().setUrl('https://global.api.pvp.net/api/lol/static-data/' + LoLChamps.app.REGION + '/v1.2/champion?locale=' + LoLChamps.app.LOCALE + '&champData=info&api_key=' + apiKey);
				Ext.getCmp('champlistview').setMasked({
					xtype: 'loadmask',
					message: 'Retrieving Champion List for ' + LoLChamps.app.REGION.toUpperCase()
				});
			}, 
			load: function(store, records, successful, operation, eOpts) {
				store.sort('name', 'ASC');
				Ext.getCmp('champlistview').setMasked(false);
				if (records) {
					if (records.length > 0) {
						LoLChamps.app.VERSION = records[0].getData().version;
					}
				}
			}
		}
	}
});