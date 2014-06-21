Ext.define('LoLChamps.controller.ChampController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List', 'Ext.Img', 'Ext.tab.Panel'
	],
	xtype: 'champcontroller',
	
	CHAMPION_SQUARE_WIDTH: 80,
	
	config: {
		views: [
			'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView', 'NavigationBar'
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
			ChampLoreView: '#champinfoview #champtabpanel #champlore',
			NavigationBar: '#navigationbar'
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
				},
				focus: function(e, eOpts) {
					this.getNavigationBar().hide();
				},
				blur: function(e, eOpts) {
					this.getNavigationBar().show();
				}
			}
		}
	},
	
	// This is launched after app launch initialization
	launch: function() {
		this.addSwipeEvents();
		this.addTapEvents();
	},
	
	getImageSrcPath: function() {
		return 'http://ddragon.leagueoflegends.com/cdn/' + LoLChamps.app.VERSION + '/img';
	},
	
	onChampPanelTap: function(target, object, e, eOpts) {
		if (object.nodeName == 'IMG' || object.nodeName == 'OBJECT') {
			var strID = object.name;
			var tokenIndex = strID.search('_');
			LoLChamps.app.CHAMPION_SEL_TXT = strID.substring(0,tokenIndex);
			LoLChamps.app.CHAMPION_ID = parseInt(strID.substring(tokenIndex+1));
			LoLChamps.app.setUrl('champinfoview');
			this.cleanChampInfo();
			Ext.getStore('champinfostore').load({
				callback: function(records, operation, success) {
					if (success) {
						LoLChamps.app.CHAMPION_DATA = records;
						this.generateChampInfo(records);
					}
				}, scope: LoLChamps.app.getController('ChampController')
			});
		}
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
			this.getChampLoreView().setStyle({'font-size': '100%', 'margin': '5px 10px 5px 10px'});
		}
	},
	
	createSpellsPanel: function(champData) {
//		var passivePanel = this.createPassivePanel(champData.passive);
		var passivePanel = this.createSpellPanel(champData.passive);
		var spellPanel1 = this.createSpellPanel(champData.spells[0]);
		var spellPanel2 = this.createSpellPanel(champData.spells[1]);
		var spellPanel3 = this.createSpellPanel(champData.spells[2]);
		var spellPanel4 = this.createSpellPanel(champData.spells[3]);
		
		return {
			xtype: 'container',
			layout: 'vbox',
			items: [passivePanel,spellPanel1,spellPanel2,spellPanel3,spellPanel4]
		};
	},
	
	createSpellPanel: function(spell) {
		var isPassive = spell.effect == null? '/passive/' : '/spell/';
		var spellTitle = '<b style="float:left"><u>'+ spell.name +'</u></b>';
		if (spell.cooldownBurn && spell.cooldownBurn != 0) {
			spellTitle += '<span style="float: right; padding-right: 10px"> Cooldown: ' + spell.cooldownBurn + '</span>';
		}
		if (spell.rangeBurn) {
			spellTitle += '<br style="clear: both"><b>Range: ' + spell.rangeBurn + '</b>'; 
		}
		return {
			xtype: 'container',
			layout: 'hbox',
			items: [{
				xtype: 'image',
				src: this.getImageSrcPath() + isPassive + spell.image.full,
//				height: 64,
//				width: 64,
				flex: 15,
				style: {
					'background-size': '95%',
					'margin-right': '5px',
					'margin-left': '5px'
				}
			}, {
				xtype: 'container',
				layout: 'vbox',
				flex: 85,
				items: [{
					html: spellTitle,
					style: {
						'font-size': '90%'
					}
				}, {
//					width: columnWidth,
					html: this.encodeToolTip(spell),
					style: {
						'font-size': '90%',
						'margin-right': '10px'
					}
				}]
			}],
			style: {
				'border-bottom': '2px solid #DCDCDC'
			}
		};
	},
	
	encodeToolTip: function(spell) {
		if (spell.effect == null) {
			return spell.sanitizedDescription;
		}
		var tooltip = spell.sanitizedTooltip;
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
		var leftCol = {
			xtype: 'container',
			layout: 'vbox',
			flex: 1,
			items: leftItems
		};
		var rightCol = {
			xtype: 'container',
			layout: 'vbox',
			flex: 1,
			items: rightItems
		}
		var panel = {
			xtype: 'container',
			layout: 'hbox',
			items: [leftCol,rightCol],
			style: {
				'margin': '5px 10px 5px 10px'
			}
		};
		return panel;
	},
	
	createStatPanel: function(statLabel, statValue, statGrowth) {
		if (statLabel == 'attackspeedoffset') {
			statGrowth = statGrowth + '%';
			statValue = (1/(1.6*(1+parseFloat(statValue)))).toFixed(3);
		}
		var statperlevel = statGrowth != ""? ' (' + statGrowth + ') per level' : "";
		return {
			xtype: 'container',
			layout: 'hbox',
			items: [{
				xtype: 'image' // this is for stat icon
//				src: this.getImageSrcPath() + '/spell/' + spell.image.full,
//				height: 64,
//				width: 64,
//				style: {
//					'background-size': '95%'
//				}
			}, {
				xtype: 'container',
				layout: 'vbox',
				items: [{
					html: this.DictionaryMapStats(statLabel) +':'
				}, {
					html: statValue + statperlevel,
					style: {
						'font-size': '80%',
						'padding-bottom': '10px'
					}
				}]
			}]
		};
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
		return {
			xtype: 'container',
			layout: 'hbox',
			items: [{
				xtype: 'image',
				src: this.getImageSrcPath() + '/champion/' + champData.key + '.png',
//				width: this.CHAMPION_SQUARE_WIDTH,
//				height: this.CHAMPION_SQUARE_WIDTH,
				flex: 1,
				listeners: {
					error: function(image, event) {
						image.setSrc('resources/images/champions/Unknown_Square_0.png')
					}
				}
			}, {
				xtype: 'container',
				layout: 'vbox',
				flex: 9,
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
			}]
		};
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
//		var padding = (Ext.Viewport.getWindowWidth() - (columns*(width+8))) / 2;
		var html = '<div style="text-align: center">';
		var name_id = '';
		for (var i = 0; i < count; i++) {
//			if (i % columns == 0) {
//				html += '<div style="padding-left:' + padding + 'px">'
//			}
			name_id = champStoreData.getAt(i).get('name') + '_' + champStoreData.getAt(i).get('id');
			html += '<span style="display: inline-block; margin-left: 4px; margin-right: 4px; vertical-align: top">';
				/*fuck dis shiitz
				html += '<object data="' + this.getImageSrcPath() + '/champion/' + champStoreData.getAt(i).get('key') + '.png" type="image/png" width="' + width + '" height="' + width + '" name="' + name_id +'">';
				html +=	'<img src="resources/images/champions/Unknown_Square_0.png" width="' + width + '" height="' + width + '" alt="' + champStoreData.getAt(i).get('id') +'" name="' + name_id + '"/>';
				html += '</object>';
				*/
				html +=	'<img src="' + this.getImageSrcPath() + '/champion/' + champStoreData.getAt(i).get('key') + '.png" type="image/png" width="' + width + '" height="' + width + '" alt="' + champStoreData.getAt(i).get('id') +'" name="' + name_id + '"/>';
				html += '<p style="text-align: center; font-size: 100%; overflow: true; width:' + width + 'px">' + champStoreData.getAt(i).get('name') + '</p>';
			html += '</span>';
//			if (i % columns == columns-1 || i == count-1) {
//				html += '</div>';
//			}
		}
		html += '</div>';
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
	},
	
	addTapEvents: function() {
		this.getChampListPanel().element.on({
			tap: this.onChampPanelTap,
			scope: this
		})
	}
});
