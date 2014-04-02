Ext.define('LoLChamps.store.SummonerSummaryStore', {
	extend: 'Ext.data.Store',
	id: 'summonersummarystore',
	config: {
		storeId : 'summonersummarystore',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: '',
			model: 'LoLChamps.model.SummonerSummaryModel',
			reader: {
				type: 'json',
				rootProperty: 'playerStatSummaries'
			},
			listeners: {
				exception: function(store, response, eOpts) {
					Ext.getCmp('summonerinfoview').child('#summonertabpanel').child('#summonerstats').removeAll();
					Ext.getCmp('summonerinfoview').child('#summonertabpanel').child('#summonerranked').removeAll();
					Ext.getCmp('summonerinfoview').child('#summonertabpanel').child('#summonerstats').setHtml('<font color="red">User does not exist, please try again.</font>');
					Ext.getCmp('summonerinfoview').child('#summonertabpanel').child('#summonerranked').setHtml('<font color="red">User does not exist, please try again.</font>');
				}
			}
		},
		listeners: {
			beforeload: function(store, response, eOpts) {
				this.getProxy().setUrl('https://prod.api.pvp.net/api/lol/' + LoLChamps.app.REGION + '/v1.3/stats/by-summoner/' + LoLChamps.app.SUMMONER_ID + '/summary?season=' + LoLChamps.app.SEASON + '&api_key=' + apiKey);
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