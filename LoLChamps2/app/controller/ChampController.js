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
			ChampListSearch: '#champlistsearch',
			ChampLogoPanel: '#champinfoview #champlogopanel',
			ChampTabPanel: '#champinfoview #champtabpanel',
			ChampStatsView: '#champinfoview #champtabpanel #champstats',
			ChampSpellsView: '#champinfoview #champtabpanel #champspells',
			ChampLoreView: '#champinfoview #champtabpanel #champlore',
			NavigationBar: '#navigationbar'
		},
		control: {
			ChampListSearch: {
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
		document.addEventListener("deviceready", this.onDeviceReady, false);
		this.addSwipeEvents();
		this.addTapEvents();
	},
	
	onDeviceReady: function() {
		document.addEventListener("hidekeyboard", LoLChamps.app.getController('ChampController').onHide, false);
	},
	
	onHide: function() {
		Ext.getCmp('champlistsearch').blur();
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
				height: 64,
				width: 64,
				//flex: 15,
				style: {
					//'background-size': '95%',
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
		var tooltip = spell.tooltip;
		var indexA = tooltip.indexOf('{{');
		var indexB = tooltip.indexOf('}}');
		var count = 0;
		var keyExist = false;
		
		while (indexA > 0 && indexB > 0) {
			var effVar = tooltip.slice(indexA,indexB);
			if (effVar.indexOf('e') > 0) {
				// Changed to parse up to 2 digits (2 -> 3)
				var index = parseInt(effVar.slice(effVar.indexOf('e')+1,effVar.indexOf('e')+3));
				tooltip = tooltip.slice(0,indexA) + spell.effectBurn[index] + tooltip.slice(indexB+2);
				keyExist = true;
			} else if (effVar.indexOf('a') > 0) {
				var index = parseInt(effVar.slice(effVar.indexOf('a')+1,effVar.indexOf('a')+2));
				if (spell.vars) {
					for (var i = 0; i < spell.vars.length; i++) {
						if (spell.vars[i].key == 'a' + index) {
							tooltip = this.tooltipCleanUp(spell.key, tooltip, spell.vars[i].link, spell.vars[i].coeff, spell.vars[i].key, indexA, indexB);
							keyExist = true;
							break;
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
							tooltip = this.tooltipCleanUp(spell.key, tooltip, spell.vars[i].link, spell.vars[i].coeff, spell.vars[i].key, indexA, indexB);
							keyExist = true;
							break;
						}
					}
				} else {
					tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+2);
				}
			}
			if(!keyExist) {
				var key = (effVar.slice(3)).trim();
				tooltip = this.tooltipNonExistentKey(spell.key, key, tooltip, indexA, indexB);
			}
			
			keyExist = false;
			indexA = tooltip.indexOf('{{');
			indexB = tooltip.indexOf('}}');
			count++;
			if (count > 15) return tooltip;
		}

		return tooltip;
	},
	
	convertArray: function(coeffArr) {
		var percentArr = [];
		for(var i = 0; i < coeffArr.length; i++) {
			percentArr[i] = parseInt((coeffArr[i]*100), 10);
		}
		
		return percentArr.join('/');
	},
	
	tooltipCleanUp: function(spellKey, tooltip, link, coeff, key, indexA, indexB) {
		if(spellKey == 'AuraofDespair') {
			tooltip = tooltip.slice(0,indexA-3) + '% (+<font color="#99FF99">' + this.convertArray(coeff) + '% Per 100 AP</font>)' + tooltip.slice(indexB+4);
		} else if(spellKey == 'AsheSpiritOfTheHawk') {
			tooltip = tooltip.slice(0, indexA-23)
		} else if(spellKey == 'EvelynnQ') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#FF8C00">50/55/60/65/70% Bonus AD</font>' + tooltip.slice(indexB+2);
		} else if(spellKey == 'EvelynnR') {
			tooltip = tooltip.slice(0,indexA-3) + '% (+<font color="#99FF99">' + this.convertArray(coeff) + '% Per 100 AP</font>)' + tooltip.slice(indexB+4);
		} else if(spellKey == 'HeimerdingerQ') {
			tooltip = tooltip.slice(0,indexA-2) + tooltip.slice(indexB+3);
		} else if(spellKey == 'KarmaSpiritBind' && key == 'a2') {
			tooltip = tooltip.slice(0,indexA-4) + '% (+<font color="#99FF99">' + this.convertArray(coeff) + '% Per 100 AP</font>)' + tooltip.slice(indexB+4);
		} else if(spellKey == 'LucianQ' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-4) + '% (+<font color="#FF8C00">' + this.convertArray(coeff) + '% Bonus AD</font>)' + tooltip.slice(indexB+38);
		} else if(spellKey == 'Landslide' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-4) + '% (+<font color="yellow">' + this.convertArray(coeff) + '% Armor</font>)' + tooltip.slice(indexB+4);
		} else if(spellKey == 'MordekaiserChildrenOfTheGrave' && key == 'a1') {
			tooltip = tooltip.slice(0,indexA-3) + '% (+<font color="#99FF99">' + this.convertArray(coeff) + '% Per 100 AP</font>)' + tooltip.slice(indexB+4);
		} else if(spellKey == 'NasusQ' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + '<font color="yellow">Total Stacks of Siphoning Strike</font>) ' + tooltip.slice(indexB+4);
		} else if(spellKey == 'NautilusAnchorDrag' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-2) + tooltip.slice(indexB+3);
		} else if(spellKey == 'NautilusPiercingGaze' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-2) + '(+' + tooltip.slice(indexB+5);
		} else if(spellKey == 'DefensiveBallCurl' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + '<font color="yellow">20% Armor</font>' + tooltip.slice(indexB+2);
		} else if(spellKey == 'RengarQ' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+2);
		} else if(spellKey == 'Overload' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-2) + tooltip.slice(indexB+3);
		} else if(spellKey == 'RunePrison' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-2) + tooltip.slice(indexB+3);
		} else if(spellKey == 'SpellFlux' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-2) + tooltip.slice(indexB+3);
		} else if(spellKey == 'SejuaniNorthernWinds' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+3);
		} else if(spellKey == 'ShenVorpalStar' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+2);
		} else if(spellKey == 'ShenVorpalStar' && key == 'f3') {
			tooltip = tooltip.slice(0,indexA) + '2/3/5/6/7 (+0.5% Shen\'s Maximum Health)'+ tooltip.slice(indexB+2);
		} else if(spellKey == 'Enrage' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-23) + '.' + tooltip.slice(indexB+2);
		} else if(spellKey == 'SonaE' && key == 'a2') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#99FF99">4% Per 100 AP</font>' + tooltip.slice(indexB+3);
		} else if(spellKey == 'Imbue' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + '7% Bonus Health)' + tooltip.slice(indexB+10);
		} else if(spellKey == 'Shatter' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+2);
		} else if(spellKey == 'Shatter' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + '20% armor' + tooltip.slice(indexB+2);
		} else if(spellKey == 'Shatter' && key == 'f3') {
			tooltip = tooltip.slice(0,indexA) + '5% Armor' + tooltip.slice(indexB+2);
		} else if(spellKey == 'VarusW' && key == 'a2') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#99FF99">2% Per 100 AP</font>' + tooltip.slice(indexB+3);
		} else if(spellKey == 'VeigarBalefulStrike' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-23) + tooltip.slice(indexB+2);
		} else if(spellKey == 'VladimirSanguinePool' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+3);
		} else if(spellKey == 'VolibearW' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+3);
		} else if(spellKey == 'ZacW' && key == 'a1') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#99FF99">2% Per 100 AP</font>)' + tooltip.slice(indexB+4);
		} else if(link == '@special.BraumWArmor' || link == '@special.BraumWMR') {
			tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+2);
		} else if(link == '@dynamic.attackdamage' && spellKey == 'MissileBarrage') {
			tooltip = tooltip.slice(0,indexA) + '(+<font color="#FF8C00">' + this.convertArray(coeff) + '% AD</font>)' + tooltip.slice(indexB+2);
		} else if(link == '@special.dariusr3') {
			tooltip = tooltip.slice(0,indexA) + '320/500/680 (+<font color="#FF8C00">150% Bonus AD</font>)' + tooltip.slice(indexB+2);
		} else if(link == '@cooldownchampion') {
			tooltip = tooltip.slice(0,indexA) + coeff.join('/') + tooltip.slice(indexB+2);
		} else if(link == '@text') {
			tooltip = tooltip.slice(0,indexA) + coeff.join(' / ') + tooltip.slice(indexB+2);
		} else if(link == '@dynamic.abilitypower') {
			tooltip = tooltip.slice(0,indexA) + '(+<font color="#99FF99">' + this.convertArray(coeff) + '% AP</font>)' + tooltip.slice(indexB+2);
		} else if(link == '@special.jaxrarmor' || link == '@special.jaxrmr') {
			tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+2);
		} else if(link == '@special.viw') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#FF8C00">1% Per 35 Bonus AD</font>' + tooltip.slice(indexB+3);
		} else if(link == 'bonusarmor') {
			tooltip = tooltip.slice(0,indexA) + '<font color="yellow">' + this.convertArray(coeff) + '% Bonus Armor</font>' + tooltip.slice(indexB+2);
		} else if(link == 'bonusspellblock') {
			tooltip = tooltip.slice(0,indexA) + '<font color="yellow">' + this.convertArray(coeff) + '% Bonus Magic Resist</font>' + tooltip.slice(indexB+2);
		} else if(link == 'bonusattackdamage') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#FF8C00">' + this.convertArray(coeff) + '% Bonus AD</font>' + tooltip.slice(indexB+2);
		} else if(link == 'spelldamage') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#99FF99">' + this.convertArray(coeff) + '% AP</font>' + tooltip.slice(indexB+2);
		} else if(link == 'attackdamage') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#FF8C00">' + this.convertArray(coeff) + '% AD</font>' + tooltip.slice(indexB+2);
		} else {
			tooltip = tooltip.slice(0,indexA) + '<font color="#CC3300">' + this.convertArray(coeff) + '</font>' + tooltip.slice(indexB+2);
		}
		
		return tooltip;
	},
	
	tooltipNonExistentKey: function(spellKey, key, tooltip, indexA, indexB) {
		if(spellKey == 'AatroxW' && key == 'f5') {
			tooltip = tooltip.slice(0,indexA) + '60/75/90/105/120 +<font color="#FF8C00">75% Bonus AD</font>' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'AatroxW' && key == 'f4') {
			tooltip = tooltip.slice(0,indexA) + '15/23.75/32.5/41.25/50 (+<font color="#FF8C00">25% Bonus AD</font>)' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'AhriFoxFire') {
			tooltip = tooltip.slice(0,indexA) + '64/104/144/184/224 (+<font color="#99FF99">64% AP</font>)' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'AzirW' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + ' 50 / 55 / 60 / 65 / 70 /75 / 80 / 85 / 90 / 95 /100 / 110 / 120 / 130 / 140 /150 /160 / 170 ' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'AzirW' && key == 'maxammo') {
			tooltip = tooltip.slice(0,indexA) + ' 2 ' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'AzirW' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + ' 12/11/10/9/8 ' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'AzirW' && key == 'f3') {
			tooltip = tooltip.slice(0,indexA) + ' 80 + (25 x Azir\'s level) ' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'AzirE' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-2) + '[+' + tooltip.slice(indexB+5);
		}
		else if(spellKey == 'PhosphorusBomb' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-2) + '(+<font color="#FF8C00">50% Bonus AD</font>)(' + tooltip.slice(indexB+5);
		}
		else if(spellKey == 'EvelynnQ' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#99FF99">35/40/45/50/55% AP</font>)(' + tooltip.slice(indexB+5);
		}
		else if(spellKey == 'Parley' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA-23);
		}
		else if(spellKey == 'GnarW' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + '30' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'GragasE' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + '3' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'KarthusDefile' && key == 'cost') {
			tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'RiftWalk' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#0099FF">2% of Max Mana</font>) ' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'RiftWalk' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#0099FF">2% of Max Mana</font>) ' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'RiftWalk' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#0099FF">1% of Max Mana</font>) ' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'KhazixQ' && key == 'f3') {
			tooltip = tooltip.slice(0,indexA) + '91/123.5/156/188.5/221 (+<font color="#FF8C00">260% Bonus AD</font>) ' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'KhazixQ' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + '10 x Kha\'Zix\'s Level' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'WujuStyle' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-1) + tooltip.slice(indexB+3);
		}
		else if(spellKey == 'MissFortuneRicochetShot' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#FF8C00">85% AD</font>)' + tooltip.slice(indexB+4);
		}
		else if(spellKey == 'MissFortuneRicochetShot' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#FF8C00">100% AD</font>)' + tooltip.slice(indexB+4);
		}
		else if(spellKey == 'NamiW' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-1) + '-15% (+<font color="#99FF99">7.5% per 100 AP</font>)' + tooltip.slice(indexB+4);
		}
		else if(spellKey == 'RengarQ' && key == 'f3') {
			tooltip = tooltip.slice(0,indexA-1) + tooltip.slice(indexB+3);
		}
		else if(spellKey == 'RengarQ' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + '30-240' +tooltip.slice(indexB+2);
		}
		else if(spellKey == 'RengarQ' && key == 'f4') {
			tooltip = tooltip.slice(0,indexA) + '47 + (3 x Rengar\'s Level)' +tooltip.slice(indexB+2);
		}
		else if(spellKey == 'RengarW' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + '40-240' +tooltip.slice(indexB+2);
		}
		else if(spellKey == 'RengarW' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + '8 + (4 x Rengar\'s Level)' +tooltip.slice(indexB+2);
		}
		else if(spellKey == 'RengarW' && key == 'f3') {
			tooltip = tooltip.slice(0,indexA) + '50 + (25 x Rengar\'s Level)' +tooltip.slice(indexB+2);
		}
		else if(spellKey == 'RengarE' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + '50-340' +tooltip.slice(indexB+2);
		}
		else if(spellKey == 'SonaQ' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + '20/30/40/50/60' +tooltip.slice(indexB+2);
		}
		else if(spellKey == 'SonaW' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + '35/55/75/95/115' +tooltip.slice(indexB+2);
		}
		else if(spellKey == 'SonaW' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#99FF99">2% Per 100 AP</font>' +tooltip.slice(indexB+3);
		}
		else if(spellKey == 'SonaE' && key == 'f3') {
			tooltip = tooltip.slice(0,indexA) + '13/14/15/16/17' +tooltip.slice(indexB+2);
		}
		else if(spellKey == 'SonaE' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + '2% x Crescendo\'s Rank' +tooltip.slice(indexB+3);
		}
		else if(spellKey == 'SonaE' && key == 'f4') {
			tooltip = tooltip.slice(0,indexA) + '10/11/12/13/14' +tooltip.slice(indexB+2);
		}
		else if(spellKey == 'SonaE' && key == 'f5') {
			tooltip = tooltip.slice(0,indexA) + '2% x Crescendo\'s Rank' +tooltip.slice(indexB+3);
		}
		else if(spellKey == 'SorakaW' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#99FF99">20% AP</font>' +tooltip.slice(indexB+2);
		}
		else if(spellKey == 'Imbue' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA-2) + '(+' + tooltip.slice(indexB+5);
		}
		else if(spellKey == 'ThreshE' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+3);
		}
		else if(spellKey == 'ThreshE' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + tooltip.slice(indexB+3);
		}
		else if(spellKey == 'TwitchExpunge' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#FF8C00">25% Bonus AD</font>' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'ViktorPowerTransfer' && key == 'f3') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#99FF99">20% AP</font>' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'ViktorPowerTransfer' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + '20 / 25 / 30 / 35 / 40 / 45 / 50 / 55 / 60 / 70 / 80 / 90 / 110 / 130 / 150 / 170 / 190 / 210' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'XerathArcaneBarrage2' && key == 'f1') {
			tooltip = tooltip.slice(0,indexA) + '90/135/180/225/270' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'XerathArcaneBarrage2' && key == 'f2') {
			tooltip = tooltip.slice(0,indexA) + '<font color="#99FF99">90% AP</font>' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'ZyraQFissure' && key == 'f3') {
			tooltip = tooltip.slice(0,indexA) + '23 + (6.5 x Zyra\'s Level)' + tooltip.slice(indexB+2);
		}
		else if(spellKey == 'ZyraGraspingRoots' && key == 'f3') {
			tooltip = tooltip.slice(0,indexA) + '23 + (6.5 x Zyra\'s Level)' + tooltip.slice(indexB+2);
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
