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
				this.getProxy().setUrl(LoLChamps.app.API_URL + LoLChamps.app.REGION + '/v1.1/champion?api_key=' + apiKey);
				Ext.getCmp('champlistview').setMasked({
					xtype: 'loadmask',
					message: 'Retrieving Champion List for ' + LoLChamps.app.REGION.toUpperCase()
				});
			}, 
			load: function(store, records, successful, operation, eOpts) {
				for (var i = 0; i < records.length; i++) {
					var name = records[i].get('name');
					if (name == LoLChamps.app.DictionaryMapNames(name)) {
						records[i].getData().displayName = name;
					} else {
						records[i].getData().displayName = LoLChamps.app.DictionaryMapNames(name);
					}
				}
				store.sort('displayName', 'ASC');
				Ext.getCmp('champlistview').setMasked(false);
			}
		}
	}
});