Ext.define('LoLChamps.store.ItemListStore', {
	extend: 'Ext.data.Store',
	id: 'itemliststore',
	config: {
		storeId : 'itemliststore',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: '',
			model: 'LoLChamps.model.ItemIDModel',
			reader: {
				type: 'itemreader',
				rootProperty: 'data'
			},
			listeners: {
				exception: function(store, response, eOpts) {
					console.warn("ItemListStoreError");
				}
			}
		},
		listeners: {
			beforeload: function(store, response, eOpts) {
				this.getProxy().setUrl('https://prod.api.pvp.net/api/lol/static-data/' + LoLChamps.app.REGION + '/v1.2/item?locale=' + LoLChamps.app.LOCALE + '&itemListData=all&api_key=' + apiKey);
				Ext.getCmp('itemlistview').setMasked({
					xtype: 'loadmask',
					message: 'Retrieving Item List for ' + LoLChamps.app.REGION.toUpperCase()
				});
			}, 
			load: function(store, records, successful, operation, eOpts) {
				Ext.getCmp('itemlistview').setMasked(false);
			}
		}
	}
});