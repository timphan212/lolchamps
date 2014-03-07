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
			SummonerSubmitBtn: '#summonersubmit',
			SummonerTextField: '#summonertextfield',
			TitleBar: '#loltitlebar'
		},
		
		control: {
			SummonerSubmitBtn: {
				tap: 'onSummonerSubmitBtn'
			}
		}
	},
	
	onSummonerSubmitBtn: function() {
		if(Ext.getCmp('summonertextfield').getValue() != null) {
			LoLChamps.app.SUMMONER_NAME = Ext.getCmp('summonertextfield').getValue();
			if(!Ext.getCmp('SummonerInfo')) {
				Ext.getStore('summonerstore').load({
					callback: function(records, operation, success) {
						if(success) {
							LoLChamps.app.getController('LoLChamps.controller.SummonerController').createSummoner();
						}
					}
				})
			};
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