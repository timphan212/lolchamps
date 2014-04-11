Ext.define('LoLChamps.controller.ChampController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List', 'Ext.Img', 'Ext.tab.Panel'
	],
	xtype: 'champcontroller',
	
	CHAMPION_SQUARE_WIDTH: 80,
	IMAGE_SRC_PATH: 'http://ddragon.leagueoflegends.com/cdn/4.5.4/img',
	
	config: {
		views: [
			'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView'
		],
		refs: {
			ChampListView: '#champlistview',
			ChampListPanel: '#champlistview #champlistpanel',
			ChampInfoView: '#champinfoview',
			TitleBar: '#loltitlebar',
			SearchField: '#champlistview #champlistsearch',
			ChampLogoPanel: '#champinfoview #champlogopanel',
			ChampTabPanel: '#champinfoview #champtabpanel',
			ChampStatsView: '#champinfoview #champtabpanel #champstats',
			ChampSpellsView: '#champinfoview #champtabpanel #champspells',
			ChampLoreView: '#champinfoview #champtabpanel #champlore'
		},
		control: {
			SearchField: {
				keyup: function(field, e, eOpts) {
					if (Ext.getStore('champliststore')) {
						this.getChampListPanel().setMasked(true);
						Ext.getStore('champliststore').clearFilter();
						var regex = new RegExp(field.getValue(), 'i');
						Ext.getStore('champliststore').filter('name', regex);
						this.updateChampPanel(this.CHAMPION_SQUARE_WIDTH);
						this.getChampListPanel().setMasked(false);
					}
				},
				clearicontap: function(field, e, eOpts) {
					if (Ext.getStore('champliststore')) {
						this.getChampListPanel().setMasked(true);
						Ext.getStore('champliststore').clearFilter();
						this.updateChampPanel(this.CHAMPION_SQUARE_WIDTH);
						this.getChampListPanel().setMasked(false);
					}
				}
			}
		}
	},
	
	// This is launched after app launch initialization
	launch: function() {
		this.addSwipeEvents();
	},
	
	createChampSquare: function(id, imageName, text, width) {
		var square = {
				xtype: 'container',
				layout: 'vbox',
				items: [{
					xtype: 'image',
					src: this.IMAGE_SRC_PATH + '/champion/' + imageName +'.png',
					width: width,
					height: width,
					itemId: text + '_' + id,
					style: {
						'background-size': '95%'
					},
					listeners: {
						tap: function(image, e, eOpts) {
							var strID = image.getItemId();
							var tokenIndex = strID.search('_');
							LoLChamps.app.CHAMPION_SEL_TXT = strID.substring(0,tokenIndex);
							LoLChamps.app.CHAMPION_ID = parseInt(strID.substring(tokenIndex+1));
							LoLChamps.app.setUrl('champinfoview');
							Ext.getStore('champinfostore').load({
								callback: function(records, operation, success) {
									if (success) {
										LoLChamps.app.CHAMPION_DATA = records;
										this.cleanChampInfo();
										this.generateChampInfo(records);
									}
								}, scope: LoLChamps.app.getController('ChampController')
							});
						},
						error: function(image, event) {
							image.setSrc('resources/images/champions/Unknown_Square_0.png')
						}
					}
				}, {
					html: text,
					style: {
						'width': width+'px',
						'font-size': '60%',
						'text-align': 'center',
						'overflow': 'true'
					}
				}]
			};
		return square;
	},
	
	cleanChampInfo: function() {
		this.getChampLogoPanel().removeAll(true,true);
		this.getChampStatsView().removeAll(true,true);
		this.getChampSpellsView().removeAll(true,true);
		this.getChampLoreView().removeAll(true,true);
	},
	
	generateChampInfo: function(records) {
		if (records.length == 1) {
			var champData = records[0].getData();
			this.getChampLogoPanel().add(this.createLogoPanelForChamp(champData));
			// Stats - TODO create another panel with shit
			this.getChampStatsView().add(this.createChampStatsPanel(champData));
//			this.getChampStatsView().setStyle({'font-size': '70%'});
			// Spells - fucking crazy work
			this.getChampSpellsView().add(this.createSpellsPanel(champData));
			// Lore - TODO create another panel with many more css styling
			this.getChampLoreView().setHtml(champData.lore);
			this.getChampLoreView().setStyle({'font-size': '70%'});
		}
	},
	
	createSpellsPanel: function(champData) {
		var passivePanel = this.createPassivePanel(champData.passive);
		var spellPanel1 = this.createSpellPanel(champData.spells[0]);
		var spellPanel2 = this.createSpellPanel(champData.spells[1]);
		var spellPanel3 = this.createSpellPanel(champData.spells[2]);
		var spellPanel4 = this.createSpellPanel(champData.spells[3]);
		
		return this.createVBoxContainer([passivePanel,spellPanel1,spellPanel2,spellPanel3,spellPanel4]);
	},
	
	createPassivePanel: function(passive) {
		return this.createHBoxContainer([{
			xtype: 'image',
//			src: 'resources/images/abilities/' + passive.image.full,
			src: this.IMAGE_SRC_PATH + '/passive/' + passive.image.full,
			height: 64,
			width: 64,
			style: {
				'background-size': '95%'
			}
		}, {
			xtype: 'container',
			layout: 'vbox',
			flex: 1,
			items: [{
				html: '<b><u>'+ passive.name +'</u></b> (Passive)',
				style: {
					'font-size': '80%'
				}
			}, {
				html: passive.description,
				style: {
					'font-size': '60%'
				}
			}]
		}]);
	},
	
	createSpellPanel: function(spell) {
		var columnWidth = window.innerWidth - 64;
		return this.createHBoxContainer([{
			xtype: 'image',
			src: this.IMAGE_SRC_PATH + '/spell/' + spell.image.full,
			height: 64,
			width: 64,
			style: {
				'background-size': '95%'
			}
		}, this.createVBoxContainer([{
			xtype: 'container',
			layout: 'vbox',
			items: [{
				html: '<b><u>'+ spell.name +'</u></b>',
				style: {
					'font-size': '80%'
				}
			}, {
				width: columnWidth,
				html: this.encodeToolTip(spell),
				style: {
					'font-size': '60%'
				}
			}]
		}])
		]);
	},
	
	encodeToolTip: function(spell) {
		var tooltip = spell.tooltip;
		var indexA = tooltip.indexOf('{{');
		var indexB = tooltip.indexOf('}}');
		var count = 0;
		while (indexA > 0 && indexB > 0) {
			var effVar = tooltip.slice(indexA,indexB);
			if (effVar.indexOf('e') > 0) {
				var index = parseInt(effVar.slice(effVar.indexOf('e')+1,effVar.indexOf('e')+2));
				tooltip = tooltip.slice(0,indexA) + spell.effectBurn[index-1] + tooltip.slice(indexB+2);
			} else if (effVar.indexOf('a') > 0) {
				var index = parseInt(effVar.slice(effVar.indexOf('a')+1,effVar.indexOf('a')+2));
				if (spell.vars) {
					for (var i = 0; i < spell.vars.length; i++) {
						if (spell.vars[i].key == 'a' + index) {
							if (spell.vars[i].coeff.length) {
								tooltip = tooltip.slice(0,indexA) + '<font color="orange">' + spell.vars[i].coeff[0] + '</font>' + tooltip.slice(indexB+2);
							} else {
								tooltip = tooltip.slice(0,indexA) + '<font color="green">' + Math.round(spell.vars[i].coeff*100) + '%</font>' + tooltip.slice(indexB+2);
							}
						}
					}
				} else {
					tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+2);
				}
				
			} else if (effVar.indexOf('f') > 0) {
				var index = parseInt(effVar.slice(effVar.indexOf('f')+1,effVar.indexOf('f')+2));
				if (spell.vars) {
					for (var i = 0; i < spell.vars.length; i++) {
						if (spell.vars[i].key == 'f' + index) {
							if (spell.vars[i].coeff.length) {
								tooltip = tooltip.slice(0,indexA) + '<font color="orange">' + spell.vars[i].coeff[0] + '</font>' + tooltip.slice(indexB+2);
							} else {
								tooltip = tooltip.slice(0,indexA) + '<font color="orange">' + Math.round(spell.vars[i].coeff*100) + '%</font>' + tooltip.slice(indexB+2);
							}
						}
					}
				} else {
					tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+2);
				}
			}
			indexA = tooltip.indexOf('{{');
			indexB = tooltip.indexOf('}}');
			count++;
			if (count > 10) return tooltip;
		}
		return tooltip;
	},
	
	createChampStatsPanel: function(champData) {
		var stats = champData.stats;
		var leftItems = [this.createStatPanel('hp', stats['hp'], stats['hpperlevel']),
		                 this.createStatPanel('hpregen', stats['hpregen'], stats['hpregenperlevel']),
		                 this.createStatPanel('attackdamage', stats['attackdamage'], stats['attackdamageperlevel']),
		                 this.createStatPanel('attackrange', stats['attackrange'], ""),
		                 this.createStatPanel('movespeed', stats['movespeed'], "")];
		var rightItems = [this.createStatPanel('mp', stats['mp'], stats['mpperlevel']),
		                  this.createStatPanel('mpregen', stats['mpregen'], stats['mpregenperlevel']),
		                  this.createStatPanel('attackspeedoffset', stats['attackspeedoffset'], stats['attackspeedperlevel']),
		                  this.createStatPanel('armor', stats['armor'], stats['armorperlevel']),
		                  this.createStatPanel('spellblock', stats['spellblock'], stats['spellblockperlevel'])];
		var leftCol = this.createVBoxContainer(leftItems);
		var rightCol = this.createVBoxContainer(rightItems);
		var panel = {
			xtype: 'container',
			layout: 'hbox',
			flex: 1,
			items: [leftCol,rightCol]
			
		};
//		return this.createHBoxContainer([leftCol,rightCol]);
		return panel;
	},
	
	createStatPanel: function(statLabel, statValue, statGrowth) {
		if (statLabel == 'attackspeedoffset') {
			statGrowth = statGrowth + '%';
			statValue = (1/(1.6*(1+parseFloat(statValue)))).toFixed(3);
		}
		var statperlevel = statGrowth != ""? ' (' + statGrowth + ') per level' : "";
		return this.createHBoxContainer([{
			xtype: 'image'
//			src: this.IMAGE_SRC_PATH + '/spell/' + spell.image.full,
//			height: 64,
//			width: 64,
//			style: {
//				'background-size': '95%'
//			}
		}, this.createVBoxContainer([{
			xtype: 'container',
			layout: 'vbox',
			width: window.innerWidth/2,
			items: [{
				html: this.DictionaryMapStats(statLabel) +':'
			}, {
				html: statValue + statperlevel,
				style: {
					'font-size': '80%'
				}
			}]
		}])
		]);
	},
	
	DictionaryMapStats: function(text) {
		var dictionary = {
			'armor': 'Armor',
			'attackdamage': 'Attack Damage',
			'attackrange': 'Attack Range',
			'attackspeedoffset': 'Attack Speed',
			'hp': 'Health',
			'hpregen': 'Health Regen',
			'movespeed': 'Movement Speed',
			'mp': 'Mana',
			'mpregen': 'Mana Regen',
			'spellblock': 'Magic Resist'
		};
		if (dictionary[text]) {
			return dictionary[text];
		} else {
			return text;
		}
	},
	
	createLogoPanelForChamp: function(champData) {
		var logoPanel = this.createHBoxContainer();
		
		logoPanel.items.push({
			xtype: 'image',
//			src: 'resources/images/champions/' + champData.id + '_Square_0.png',
			src: this.IMAGE_SRC_PATH + '/champion/' + champData.key + '.png',
			width: this.CHAMPION_SQUARE_WIDTH,
			height: this.CHAMPION_SQUARE_WIDTH,
			style: {
				'background-size': '95%'
			},
			listeners: {
				error: function(image, event) {
					image.setSrc('resources/images/champions/Unknown_Square_0.png')
				}
			}
		});
		logoPanel.items.push({
			xtype: 'container',
			layout: 'vbox',
			flex: 1,
			items: [{
				html: champData.name,
				style: {
					'font-size': '170%',
					'text-align': 'center'
				}
			}, {
				html: champData.title,
				style: {
					'font-size': '75%',
					'text-align': 'center'
				}
			}]
		});
		return logoPanel;
	},
	
	createHBoxContainer: function(items) {
		return {
			xtype: 'container',
			layout: 'hbox',
			items: items? items : []
		}
	},
	
	createVBoxContainer: function(items) {
		return {
			xtype: 'container',
			layout: 'vbox',
			items: items? items : []
		}
	},
	
	updateChampPanel: function(width) {
		if (Ext.getCmp('champpanel')) {
			Ext.getCmp('champpanel').destroy();
		}
		this.getChampListPanel().setMasked({
			xtype: 'loadmask',
			message: 'Filtering List'
		});
		var champStoreData = Ext.getStore('champliststore').getData();
		var count = Ext.getStore('champliststore').getCount();
		var columns = Math.floor(Ext.Viewport.getWindowWidth() / (width+8));
		var rows = Math.ceil(count / columns);
		var padding = (Ext.Viewport.getWindowWidth() - (columns*(width+8))) / 2;
		var html = '';
		for (var i = 0; i < count; i++) {
			if (i % columns == 0) {
				html += '<div style="padding-left:' + padding + 'px">'
			}
			html += '<span style="display: inline-block; margin-left: 4px; margin-right: 4px"><img src="' + this.IMAGE_SRC_PATH + '/champion/' + champStoreData.getAt(i).get('key') + '.png" width="' + width + '" height="' + width + '"/>';
			html += '<p style="text-align: center; font-size: 65%; overflow: true; width:' + width + 'px">' + champStoreData.getAt(i).get('name') + '</p>';
			html += '</span>';
			if (i % columns == columns-1 || i == count-1) {
				html += '</div>';
			}
		}
		this.getChampListPanel().setHtml(html);
		this.getChampListPanel().setMasked(false);
	},
	
	createChampList: function() {
		if (Ext.getCmp('champpanel')) {
			this.getChampListPanel().removeAll(true,true);
		}
		// Create Grid of Champions
		this.updateChampPanel(this.CHAMPION_SQUARE_WIDTH);
	},
	
	addSwipeEvents: function() {
		this.getChampStatsView().element.on({
			swipe: function(event, node, eOpts) {
				if (event.direction == 'left') {
					this.getChampTabPanel().setActiveItem(this.getChampSpellsView());
				}
			},
			scope: this
		});
		this.getChampSpellsView().element.on({
			swipe: function(event, node, eOpts) {
				if (event.direction == 'right') {
					this.getChampTabPanel().setActiveItem(this.getChampStatsView());
				} else if (event.direction == 'left') {
					this.getChampTabPanel().setActiveItem(this.getChampLoreView());
				}
			},
			scope: this
		});
		this.getChampLoreView().element.on({
			swipe: function(event, node, eOpts) {
				if (event.direction == 'right') {
					this.getChampTabPanel().setActiveItem(this.getChampSpellsView());
				}
			},
			scope: this
		})
	}
});
