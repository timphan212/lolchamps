Ext.define('LoLChamps.store.ChampInfoStore', {
	extend: 'Ext.data.Store',
	id: 'champinfostore',
	config: {
		storeId : 'champinfostore',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: 'https://prod.api.pvp.net/api/lol/static-data/' + LoLChamps.app.REGION + '/v1/champion/' + LoLChamps.app.CHAMPION_ID + '?champData=all&api_key=' + apiKey,
			model: 'LoLChamps.model.ChampInfoModel',
			reader: {
				type: 'json'
			},
			listeners: {
				exception: function(store, response, eOpts) {
					console.warn("ChampInfoStoreError");
				}
			}
		},
		listeners: {
			beforeload: function(store, response, eOpts) {
				this.getProxy().setUrl('https://prod.api.pvp.net/api/lol/static-data/' + LoLChamps.app.REGION + '/v1/champion/' + LoLChamps.app.CHAMPION_ID + '?champData=all&api_key=' + apiKey);
				Ext.getCmp('champinfoview').setMasked({
					xtype: 'loadmask',
					message: 'Retrieving Champion Info for ' + LoLChamps.app.CHAMPION_SEL_TXT
				});
			},
			load: function(store, records, successful, operation, eOpts) {
				Ext.getCmp('champinfoview').setMasked(false);
			}
		}
	}
});