Ext.define('LoLChamps.store.SummonerRankedStore', {
	extend: 'Ext.data.Store',
	id: 'summonerrankedstore',
	config: {
		storeId : 'summonerrankedstore',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: '',
			model: 'LoLChamps.model.SummonerRankedModel',
			reader: {
				type: 'json'
			},
			listeners: {
				exception: function(store, response, eOpts) {
					Ext.getCmp('summonerinfoview').child('#summonertabpanel').child('#summonerranked').removeAll();	
					if (response.status == 401) {
						Ext.getCmp('summonerinfoview').child('#summonertabpanel').child('#summonerranked').setHtml('<font color="red">Ranked information is not available for ' + LoLChamps.app.REGION.toUpperCase() + ' server.</font>');
					}
					else {
						Ext.getCmp('summonerinfoview').child('#summonertabpanel').child('#summonerranked').setHtml('<font color="red">User has not played ranked games before.</font>');
					}
				}
			}
		},
		listeners: {
			beforeload: function(store, response, eOpts) {
				this.getProxy().setUrl('https://prod.api.pvp.net/api/lol/' + LoLChamps.app.REGION + '/v2.3/league/by-summoner/' + LoLChamps.app.SUMMONER_ID + '/entry?api_key=' + apiKey);
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