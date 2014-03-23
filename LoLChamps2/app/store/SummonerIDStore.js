Ext.define('LoLChamps.store.SummonerIDStore', {
	extend: 'Ext.data.Store',
	id: 'summoneridstore',
	config: {
		storeId : 'summoneridstore',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: '',
			model: 'LoLChamps.model.SummonerIDModel',
			reader: {
				type: 'summonerreader'
			},
			listeners: {
				exception: function(store, response, eOpts) {
					Ext.getCmp('summonerinfoview').child('#summonertabpanel').child('#summonerstats').setHtml('<font color="red">User does not exist, please try again.</font>');
					Ext.getCmp('summonerinfoview').child('#summonertabpanel').child('#summonerranked').setHtml('<font color="red">User does not exist, please try again.</font>');
				}
			}
		},
		listeners: {
			beforeload: function(store, response, eOpts) {
				this.getProxy().setUrl('https://prod.api.pvp.net/api/lol/' + LoLChamps.app.REGION + '/v1.3/summoner/by-name/' + LoLChamps.app.SUMMONER_NAME + '?api_key=' + apiKey);
				Ext.getCmp('summonerinfoview').setMasked({
					xtype: 'loadmask',
					message: 'Retrieving Summoner from ' + LoLChamps.app.REGION.toUpperCase()
				});
			}, 
			load: function(store, records, successful, operation, eOpts) {
				Ext.getCmp('summonerinfoview').setMasked(false);
			}
		}
	}
});