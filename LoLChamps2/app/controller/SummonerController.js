Ext.define('LoLChamps.controller.SummonerController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List', 'Ext.Img', 'Ext.XTemplate'
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
			SummonerStatsID: '#summonerinfoview #summonertabpanel #summonerstats #summonerid',
			SummonerStatsSummary: '#summonerinfoview #summonertabpanel #summonerstats #summonersummary',
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
		if(Ext.getCmp('summonerstats')) {
			Ext.getCmp('summonerstats').destroy();
		}
		if(Ext.getCmp('summonertextfield').getValue() != null) {
			LoLChamps.app.SUMMONER_NAME = Ext.getCmp('summonertextfield').getValue();
			if(!Ext.getCmp('summonerstats')) {
				Ext.getStore('summoneridstore').load({
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
		if(Ext.getStore('summoneridstore')) {
			var summonerInfo = Ext.getStore('summoneridstore').getData().getAt(0).getData();
			LoLChamps.app.SUMMONER_ID = summonerInfo.id;
			this.getSummonerSummary();
		}
	},
	
	getSummonerSummary: function() {
		if(Ext.getStore('summonersummarystore')) {
			Ext.getStore('summonersummarystore').load({
				callback: function(records, operation, success) {
					if(success) {
						LoLChamps.app.getController('SummonerController').createSummonerSummary();
					}
				}
			})
		}
	},
	
	createSummonerSummary: function() {
		if(Ext.getCmp('SummonerSummary')) {
			Ext.getCmp('SummonerSummary').destroy();
		}
		if(Ext.getStore('summonersummarystore')) {
			for(var i = 0; i < Ext.getStore('summonersummarystore').getCount(); i++) {
				var currItem = Ext.getStore('summonersummarystore').getData().getAt(i).getData();
				if(currItem.wins == 0 && currItem.losses == 0) {
					Ext.getStore('summonersummarystore').removeAt(i);
				}
			}
			var tpl = new Ext.XTemplate(
					'{[LoLChamps.app.getController(\'SummonerController\').formatSummaryTemplate(values)]}'
			);
			var list = Ext.create('Ext.dataview.List', {
				id: 'SummonerSummary',
				store: Ext.getStore('summonersummarystore'),
				itemTpl: tpl,
				listeners: {
					itemtap: function(index, target, record, e, eOpts) {
						var currItem = Ext.getStore('summonersummarystore').getData().getAt(target).getData();
					}
				}
			});

			this.getSummonerStatsView().add(list);
			this.getSummonerRanked();
		}
	},
	
	getSummonerRanked: function() {
		if(Ext.getStore('summonerrankedstore')) {
			Ext.getStore('summonerrankedstore').load({
				callback: function(records, operation, success) {
					if(success) {
						LoLChamps.app.getController('SummonerController').createSummonerRanked();
					}
				}
			})
		}
	},
	
	createSummonerRanked: function() {
		if(Ext.getStore('summonerrankedstore')) {
			var summonerRanked = Ext.getStore('summonerrankedstore').getData();
			var rankedStr = '';
			for(var i = 0; i < summonerRanked.getCount(); i++) {
				rankedStr += 'Mode: ' + this.formatQueueType(summonerRanked.getAt(i).getData().queueType) + '<BR>' +
							 'Name/Team Name: ' + summonerRanked.getAt(i).getData().playerOrTeamName + '<BR>' +
							 'League Name: ' + summonerRanked.getAt(i).getData().leagueName + '<BR>' +
							 'Tier: ' + summonerRanked.getAt(i).getData().tier + ' ' + summonerRanked.getAt(i).getData().rank + '<BR>' +
							 'League Points: ' + summonerRanked.getAt(i).getData().leaguePoints + ' LP <BR>' +
							 'Wins: ' + summonerRanked.getAt(i).getData().wins + '<BR>';
				
				if(summonerRanked.getAt(i).getData().miniSeries != null) {
					var wins = summonerRanked.getAt(i).getData().miniSeries.wins;
					var losses = summonerRanked.getAt(i).getData().miniSeries.losses;
					var target = summonerRanked.getAt(i).getData().miniSeries.target - wins
					rankedStr += 'Promotional Series: ' + wins + ' wins/' + losses + ' losses (Needs ' + target + ' win(s) left!) <BR>';
				}
				
				rankedStr += '<BR>';
			}
			
			this.getSummonerRankedView().setHtml(rankedStr);
		}
	},
	
	formatMode: function(modeStr) {
		if(modeStr == 'AramUnranked5x5') {
			return 'Howling Abyss';
		}
		else if(modeStr == 'CoopVsAI') {
			return 'Summoner\'s Rift (Co-op vs. AI)'; 
		}
		else if(modeStr == 'CoopVsAI3x3') {
			return 'Twisted Treeline (Co-op vs. AI)';
		}
		else if(modeStr == 'OdinUnranked') {
			return 'The Crystal Scar';
		}
		else if(modeStr == 'RankedPremade3x3') {
			return 'Twisted Treeline (Ranked Pre-made)';
		}
		else if(modeStr == 'RankedPremade5x5') {
			return 'Summoner\'s Rift (Ranked Pre-made)';
		}
		else if(modeStr == 'RankedSolo5x5') {
			return 'Summoner\'s Rift (Ranked Solo/Duo)';
		}
		else if(modeStr == 'RankedTeam3x3') {
			return 'Twisted Treeline (Ranked Teams)';
		}
		else if(modeStr == 'RankedTeam5x5') {
			return 'Summoner\'s Rift (Ranked Teams)';
		}
		else if(modeStr == 'Unranked') {
			return 'Summoner\'s Rift (Normal)';		
		}
		else if(modeStr == 'Unranked3x3') {
			return 'Twisted Treeline (Normal)';
		}
		else if(modeStr == 'OneForAll5x5') {
			return 'One For All';
		}
		else if(modeStr == 'FirstBlood1x1') {
			return 'First Blood (1v1)';
		}
		else if(modeStr == 'FirstBlood2x2') {
			return 'First Blood (2v2)';
		}
		else if(modeStr == 'SummonersRift6x6') {
			return 'Hexakill';
		}
		else if(modeStr == 'CAP5x5') {
			return 'Summoner\'s Rift (Team Builder)';
		}
		else {
			return modeStr;
		}
	},
	
	formatQueueType: function(rankedStr) {
		if(rankedStr == 'RANKED_TEAM_3x3') {
			return 'Twisted Treeline';
		}
		else if(rankedStr == 'RANKED_TEAM_5x5') {
			return 'Summoner\'s Rift (Ranked Teams)';
		}
		else if(rankedStr == 'RANKED_SOLO_5x5') {
			return 'Summoner\'s Rift (Ranked Solo)';
		}
		else {
			return rankedStr;
		}
	},
	
	formatSummaryTemplate: function(values) {
		tempStr = '';
		
		if(values.wins == 0 && values.losses == 0) {
			return;
		}
		
		tempStr += '<p>Mode: ' + this.formatMode(values.playerStatSummaryType) + '</p>';
		tempStr += '<p>Wins: ' + values.wins + '</p>';
		
		if(values.losses != null) {
			tempStr += '<p>Losses: ' + values.losses + '</p>';
		}
		
		return tempStr;
	},
});