Ext.define('LoLChamps.store.ItemIDStore', {
	extend: 'Ext.data.Store',
	id: 'itemidstore',
	config: {
		storeId : 'itemidstore',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: 'https://prod.api.pvp.net/api/lol/static-data/'+ LoLChamps.app.REGION + '/v1/item/'+ LoLChamps.app.ITEM_ID + '?locale=en_US&itemData=all&api_key=' + apiKey,
			model: 'LoLChamps.model.ItemIDModel',
			reader: {
				type: 'json'
			},
			listeners: {
				exception: function(store, response, eOpts) {
					console.warn("ItemIDStoreError");
				}
			}
		},
		listeners: {
			beforeload: function(store, response, eOpts) {
				this.getProxy().setUrl('https://prod.api.pvp.net/api/lol/static-data/'+ LoLChamps.app.REGION + '/v1/item/'+ LoLChamps.app.ITEM_ID + '?locale=en_US&itemData=all&api_key=' + apiKey);
				Ext.getCmp('itemlistview').setMasked({
					xtype: 'loadmask',
					message: 'Retrieving Item Info for ' + LoLChamps.app.ITEM_ID
				});
			},
			load: function(store, records, successful, operation, eOpts) {
				Ext.getCmp('itemlistview').setMasked(false);
			}
		}
	}
});