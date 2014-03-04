Ext.define('LoLChamps.controller.SummonerController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List', 'Ext.Img'
	],
	xtype: 'summonercontroller',
	config: {
		views: [
			'TitleBar', 'summoner.SummonerInfoView'
		],
		refs: {
			SummonerInfoView: '#summonerinfoview',
			SummonerIDContainer: '#summonerinfoview #summoneridcontainer',
			TitleBar: '#loltitlebar'
		}
	},
	
	createSummoner: function() {
		if(Ext.getStore('summonerstore')) {
			var summonerView = Ext.getCmp('summonerinfoview').child('#summoneridcontainer');
			var summonerInfo = Ext.getStore('summonerstore').getData().getAt(0).getData();
		
			summonerView.setHtml('ID: ' + summonerInfo.id + '<BR>' +
								 'Name: ' + summonerInfo.name + '<BR>' +
								 'Level: ' + summonerInfo.summonerLevel);
		}
	}
});