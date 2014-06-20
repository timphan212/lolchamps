Ext.define('LoLChamps.store.ChampInfoStore', {
	extend: 'Ext.data.Store',
	id: 'champinfostore',
	config: {
		storeId : 'champinfostore',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: '',
			model: 'LoLChamps.model.ChampInfoModel',
			reader: {
				type: 'json'
			},
			listeners: {
				exception: function(store, response, eOpts) {
					console.warn("ChampInfoStoreError");
					if (response.status == 404) {
						Ext.Msg.alert('Champion not found', '');
					}
				}
			}
		},
		listeners: {
			beforeload: function(store, response, eOpts) {
				this.getProxy().setUrl('https://global.api.pvp.net/api/lol/static-data/' + LoLChamps.app.REGION + '/v1.2/champion/' + LoLChamps.app.CHAMPION_ID + '?locale=' + LoLChamps.app.LOCALE + '&champData=all&api_key=' + apiKey);
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