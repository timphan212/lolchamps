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
			SummonerTabPanel: '#summonerinfoview #summonertabpanel',
			SummonerStatsView: '#summonerinfoview #summonertabpanel #summonerstats',
			SummonerRankedView: '#summonerinfoview #summonertabpanel #summonerranked',
			SummonerRecentView: '#summonerinfoview #summonertabpanel #summonerrecent',
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
	
	launch: function() {
		this.addSwipeEvents();
	},
	
	addSwipeEvents: function() {
		this.getSummonerStatsView().element.on({
			swipe: function(event, node, eOpts) {
				if (event.direction == 'left') {
					this.getSummonerTabPanel().setActiveItem(this.getSummonerRankedView());
				}
			},
			scope: this
		});
		this.getSummonerRankedView().element.on({
			swipe: function(event, node, eOpts) {
				if (event.direction == 'right') {
					this.getSummonerTabPanel().setActiveItem(this.getSummonerStatsView());
				} else if (event.direction == 'left') {
					this.getSummonerTabPanel().setActiveItem(this.getSummonerRecentView());
				}
			},
			scope: this
		});
		this.getSummonerRecentView().element.on({
			swipe: function(event, node, eOpts) {
				if (event.direction == 'right') {
					this.getSummonerTabPanel().setActiveItem(this.getSummonerRankedView());
				}
			},
			scope: this
		})
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
			var summonerInfo = Ext.getStore('summonerstore').getData().getAt(0).getData();
			LoLChamps.app.SUMMONER_ID = summonerInfo.id;
			this.getSummonerStatsView().setHtml('ID: ' + summonerInfo.id + '<BR>' +
								 'Name: ' + summonerInfo.name + '<BR>' +
								 'Level: ' + summonerInfo.summonerLevel);
		}
	}
});