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
			SummonerSubmitBtn: '#summonersubmit',
			SummonerTextField: '#summonertextfield',
			SummonerTapView: '#summonertapview',
			SummonerTapPanel: '#summonertapview #summonertappanel',
			SummonerTextField: '#summonerinfoview #summonertextfield',
			TitleBar: '#loltitlebar'
		},
		
		control: {
			SummonerSubmitBtn: {
				tap: 'onSummonerSubmitBtn'
			},
			SummonerTextField: {
				action: 'onSummonerSubmitBtn'
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
				}
			},
			scope: this
		});
	},
	
	onSummonerSubmitBtn: function() {
		if(Ext.getCmp('summonerstats')) {
			Ext.getCmp('summonerstats').destroy();
		}
		this.getSummonerTabPanel().setMasked({
			xtype: 'loadmask',
			message: 'Loading'
		});
		if(Ext.getCmp('summonertextfield').getValue() != null && Ext.getCmp('summonertextfield').getValue().length > 0) {
			LoLChamps.app.SUMMONER_NAME = Ext.getCmp('summonertextfield').getValue();
			if(!Ext.getCmp('summonerstats')) {
				Ext.getStore('summoneridstore').load({
					callback: function(records, operation, success) {
						if(success) {
							LoLChamps.app.getController('LoLChamps.controller.SummonerController').createSummoner();
						}
					}
				});
			}
		}
		this.getSummonerTabPanel().setMasked(false);
	},
	
	createSummoner: function() {
		if(Ext.getStore('summoneridstore')) {
			var summonerInfo = Ext.getStore('summoneridstore').getData().getAt(0).getData();
			LoLChamps.app.SUMMONER_ID = summonerInfo.id;
			LoLChamps.app.SUMMONER_NAME = summonerInfo.name;
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
						LoLChamps.app.MODE_TXT = LoLChamps.app.getController('SummonerController').formatMode(currItem.playerStatSummaryType);
						LoLChamps.app.setUrl('summonertapview');
						var htmlStr = LoLChamps.app.getController('SummonerController').formatSummonerSummary(currItem);
						Ext.getCmp('summonertapview').child('#summonertappanel').setHtml(htmlStr);
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
		if(Ext.getCmp('SummonerRanked')) {
			Ext.getCmp('SummonerRanked').destroy();
		}
		if(Ext.getStore('summonerrankedstore')) {
			var summonerRanked = Ext.getStore('summonerrankedstore').getData();
			var rankedStr = '';
			console.log(summonerRanked);
			var tpl = new Ext.XTemplate(
					'{[LoLChamps.app.getController(\'SummonerController\').formatRankedTemplate(values)]}</div>'
			);
			var list = Ext.create('Ext.dataview.List', {
				id: 'SummonerRanked',
				store: Ext.getStore('summonerrankedstore'),
				itemTpl: tpl,
				listeners: {
					itemtap: function(index, target, record, e, eOpts) {
						var currItem = Ext.getStore('summonerrankedstore').getData().getAt(target).getData();
						LoLChamps.app.MODE_TXT = LoLChamps.app.getController('SummonerController').formatMode(currItem.playerOrTeamName);
						LoLChamps.app.setUrl('summonertapview');
						var htmlStr = LoLChamps.app.getController('SummonerController').formatSummonerRanked(currItem);
						Ext.getCmp('summonertapview').child('#summonertappanel').setHtml(htmlStr);
					}
				}
			});
			
			this.getSummonerRankedView().add(list);
		}
	},
	
	formatMode: function(modeStr) {
		var str = '';
		switch(modeStr) {
			case 'AramUnranked5x5':
				str = 'Howling Abyss';
				break;
			case 'CoopVsAI':
				str = 'Summoner\'s Rift (Co-op vs. AI)';
				break;
			case 'CoopVsAI3x3':
				str = 'Twisted Treeline (Co-op vs. AI)';
				break;
			case 'OdinUnranked':
				str = 'The Crystal Scar';
				break;
			case 'RankedPremade3x3':
				str = 'Twisted Treeline (Ranked Pre-made)';
				break;
			case 'RankedPremade5x5':
				str = 'Summoner\'s Rift (Ranked Pre-made)';
				break;
			case 'RankedSolo5x5':
				str = 'Summoner\'s Rift (Ranked Solo/Duo)';
				break;
			case 'RankedTeam5x5':
				str = 'Summoner\'s Rift (Ranked Teams)';
				break;
			case 'RankedTeam3x3':
				str = 'Twisted Treeline (Ranked)';
				break;
			case 'Unranked':
				str = 'Summoner\'s Rift (Normal)';
				break;
			case 'Unranked3x3':
				str = 'Twisted Treeline (Normal)';
				break;
			case 'OneForAll5x5':
				str = 'One For All';
				break;
			case 'FirstBlood1x1':
				str = 'First Blood (1v1)';
				break;
			case 'FirstBlood2x2':
				str = 'First Blood (2v2)';
				break;
			case 'SummonersRift6x6':
				str = 'Hexakill';
				break;
			case 'CAP5x5':
				str = 'Summoner\'s Rift (Team Builder)';
				break;
			case 'URF':
				str = 'Ultra Rapid Fire Mode';
				break;
			case 'URFBots':
				str = 'Ultra Rapid Fire Mode (Co-op vs. AI)';
				break;
			default:
				str = modeStr;
				break;
		}
		
		return str;
	},
	
	formatQueueType: function(rankedStr) {
		var str = '';
		switch (rankedStr) {
			case 'RANKED_TEAM_3x3':
				str = 'Twisted Treeline';
				break;
			case 'RANKED_TEAM_5x5':
				str = 'Summoner\'s Rift (Ranked Teams)';
				break;
			case 'RANKED_SOLO_5x5':
				str = 'Summoner\'s Rift (Ranked Solo/Duo)';
				break;
			default:
				str = rankedStr;
				break;
		}
		
		return str;
	},
	
	formatSummonerSummary: function(currItem) {
		var str = '';
		
		if(currItem != null) {
			str += 'Wins: ' + currItem.wins + '<BR>';
			
			if(currItem.losses != null) {
				str += 'Losses: ' + currItem.losses + '<BR>';
			}
			
			str += '<BR>';
			
			for(var stat in currItem.aggregatedStats) {
				var statStr = this.formatAggregateStats(stat);
				str += statStr + ': ' + currItem.aggregatedStats[stat] + '<BR>';
			}
		}
		
		return str;
	},
	
	formatAggregateStats: function(statStr) {
		var str = '';
		
		switch(statStr) {
			case 'averageAssists':
				str = 'Average Assists';
				break;
			case 'averageChampionsKilled':
				str = 'Average Champions Killed';
				break;
			case 'averageCombatPlayerScore':
				str = 'Average Combat Player Score';
				break;
			case 'averageNodeCapture':
				str = 'Average Node Capture';
				break;
			case 'averageNodeCaptureAssist':
				str = 'Average Node Capture Assist';
				break;
			case 'averageNodeNeutralize':
				str = 'Average Node Neutralize';
				break;
			case 'averageNodeNeutralizeAssist':
				str = 'Average Node Neutralize Assist';
				break;
			case 'averageNumDeaths':
				str = 'Average Number of Deaths';
				break;
			case 'averageObjectivePlayerScore':
				str = 'Average Objective Player Score';
				break;
			case 'averageTeamObjective':
				str = 'Average Team Objective';
				break;
			case 'averageTotalPlayerScore':
				str = 'Average Total Player Score';
				break;
			case 'botGamesPlayed':
				str = 'Bot Games Played';
				break;
			case 'killingSpree':
				str = 'Killing Spree';
				break;
			case 'maxAssists':
				str = 'Highest Assist Count';
				break;
			case 'maxChampionsKilled':
				str = 'Highest Champion Kill Count';
				break;
			case 'maxCombatPlayerScore':
				str = 'Highest Combat Player Score';
				break;
			case 'maxLargestCriticalStrike':
				str = 'Largest Critical Strike';
				break;
			case 'maxLargestKillingSpree':
				str = 'Largest Killing Spree';
				break;
			case 'maxNodeCapture':
				str = 'Highest Node Capture Count';
				break;
			case 'maxNodeCaptureAssist':
				str = 'Highest Node Capture Assist Count';
				break;
			case 'maxNodeNeutralize':
				str = 'Highest Node Neutralize Count';
				break;
			case 'maxNodeNeutralizeAssist':
				str = 'Highest Node Neutralize Assist Count';
				break;
			case 'maxNumDeaths':
				str = 'Highest Number of Deaths';
				break;
			case 'maxObjectivePlayerScore':
				str = 'Highest Objective Player Score';
				break;
			case 'maxTeamObjective':
				str = 'Highest Team Objective Count';
				break;
			case 'maxTimePlayed':
				str = 'Longest Time Played';
				break;
			case 'maxTimeSpentLiving':
				str = 'Longest Time Spent Alive';
				break;
			case 'maxTotalPlayerScore':
				str = 'Highest Total Player Score';
				break;
			case 'mostChampionKillsPerSession':
				str = 'Most Champion Kills Per Session';
				break;
			case 'mostSpellsCast':
				str = 'Highest Spells Cast';
				break;
			case 'normalGamesPlayed':
				str = 'Normal Games Played';
				break;
			case 'rankedPremadeGamesPlayed':
				str = 'Ranked Premade Games Played';
				break;
			case 'rankedSoloGamesPlayed':
				str = 'Ranked Solo Games Played';
				break;
			case 'totalAssists':
				str = 'Total Assists';
				break;
			case 'totalChampionKills':
				str = 'Total Champion Kills';
				break;
			case 'totalDamageDealt':
				str = 'Total Damage Dealt';
				break;
			case 'totalDamageTaken':
				str = 'Total Damage Taken';
				break;
			case 'totalDeathsPerSession':
				str = 'Total Deaths Per Session';
				break;
			case 'totalDoubleKills':
				str = 'Total Double Kills';
				break;
			case 'totalFirstBlood':
				str = 'Total First Bloods';
				break;
			case 'totalGoldEarned':
				str = 'Total Gold Earned';
				break;
			case 'totalHeal':
				str = 'Total Heal Amount';
				break;
			case 'totalMagicDamageDealt':
				str = 'Total Magic Damage Dealt';
				break;
			case 'totalMinionKills':
				str = 'Total Minions Killed';
				break;
			case 'totalNeutralMinionsKilled':
				str = 'Total Neutral Minions Killed';
				break;
			case 'totalNodeCapture':
				str = 'Total Nodes Captured';
				break;
			case 'totalNodeNeutralize':
				str = 'Total Nodes Neutralized';
				break;
			case 'totalPentaKills':
				str = 'Total Pentakills';
				break;
			case 'totalPhysicalDamageDealt':
				str = 'Total Physical Damage Dealt';
				break;
			case 'totalQuadraKills':
				str = 'Total Quadrakills';
				break;
			case 'totalSessionsLost':
				str = 'Total Sessions Lost';
				break;
			case 'totalSessionsWon':
				str = 'Total Sessions Won';
				break;
			case 'totalTripleKills':
				str = 'Total Triple Kills';
				break;
			case 'totalTurretsKilled':
				str = 'Total Turrets Killed';
				break;
			case 'totalUnrealKills':
				str = 'Total Unreal Kills';
				break;
			default:
				str = statStr;
				break;
		}
		
		return str;
	},
	
	formatSummaryTemplate: function(values) {
		tempStr = '';
		tempStr += '<p>' + this.formatMode(values.playerStatSummaryType) + '</p>';
		
		return tempStr;
	},
	
	formatSummonerRanked: function(currItem) {
		rankStr = '';
		rankStr += 'League Name: ' + currItem.leagueName + '<BR>';
		rankStr += 'Tier: ' + currItem.tier + ' '  + currItem.rank + '<BR>';
		rankStr += 'League Points: ' + currItem.leaguePoints + ' LP<BR>';
		rankStr += 'Wins: ' + currItem.wins + '<BR>';
		
		if(currItem.miniSeries != null) {
			var wins = currItem.miniSeries.wins;
			var losses = currItem.miniSeries.losses;
			var target = currItem.miniSeries.target - wins;
			
			rankStr += 'Promotional Series: ' + wins + ' wins/' + losses + ' losses (Needs ' + target + ' win(s) left!) <BR>';
		}
		
		return rankStr;
	},
	
	formatRankedTemplate: function(values) {
		tempStr = '';
		tempStr += '<div style="display:inline-block;width:100%;"><img src="resources/images/ranked/' + values.tier + '_' + values.rank + '.png" class="list-image" width="64" height="64"  style="float:left;"/>'
		tempStr += '<p>Mode: ' + this.formatQueueType(values.queueType);
		tempStr += '<BR>Name/Team Name: ' + values.playerOrTeamName + '</p></div>';
		
		return tempStr;
	}
});