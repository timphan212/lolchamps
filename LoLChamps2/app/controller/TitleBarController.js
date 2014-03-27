Ext.define('LoLChamps.controller.TitleBarController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List'
	],
	xtype: 'titlebarcontroller',
	OLD_REGION: '',
	OLD_LOCALE: '',
	config: {
		views: [
			'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView', 'item.ItemListView', 'item.ItemInfoView',
			'summoner.SummonerInfoView', 'summoner.SummonerTapView', 'Settings'
		],
		refs: {
			ChampListView: '#champlistview',
			ChampInfoView: '#champinfoview',
			ItemListView: '#itemlistview',
			ItemInfoView: '#iteminfoview',
			RefreshBtn: '#refreshbtn',
			SettingsBtn: '#settingsbtn',
			SettingsView: '#settingsview',
			SettingsLocaleSel: '#settingsview #fieldselect #localeselect',
			SettingsRegionSel: '#settingsview #fieldselect #regionselect',
			SummonerInfoView: '#summonerinfoview',
			SummonerTapView: '#summonertapview',
			SummonerTextField: '#summonertextfield',
			TitleBar: '#loltitlebar',
			TitleBarBackBtn: '#titlebackbtn',
		},
		control: {
			ChampListView: {
				show: 'onChampInfoHide',
			},
			ChampInfoView: {
				show: 'onChampInfoShow',
				hide: 'onChampInfoHide'
			},
			ItemListView: {
				show: 'onItemInfoHide'
			},
			ItemInfoView: {
				show: 'onItemInfoShow',
				hide: 'onItemInfoHide'
			},
			RefreshBtn: {
				tap: 'onRefreshBtnTap'
			},
			SettingsBtn: {
				tap: 'onSettingsBtnTap'
			},
			SettingsLocaleSel: {
				change: 'onLocaleChange'
			},
			SettingsRegionSel: {
				change: 'onRegionChange'
			},
			SettingsSeasonSel: {
				change: 'onSeasonChange'
			},
			SettingsView: {
				hide: 'onSettingsRefresh'
			},
			SummonerInfoView: {
				show: 'onSummonerTapHide'
			},
			SummonerTapView: {
				show: 'onSummonerTapShow',
				hide: 'onSummonerTapHide'
			},
			TitleBarBackBtn: {
				tap: 'onTitleBackBtnTap'
			}
		}
	},
	
	onChampInfoShow: function() {
		this.getTitleBarBackBtn().setText(LoLChamps.app.CHAMPIONS_TXT)
		this.getTitleBarBackBtn().show();
		this.getTitleBar().setTitle(LoLChamps.app.CHAMPION_SEL_TXT);
	},
	
	onChampInfoHide: function() {
		this.getTitleBarBackBtn().hide();
		this.getTitleBar().setTitle(LoLChamps.app.CHAMPIONS_TXT);
	},
	
	onTitleBackBtnTap: function() {
		LoLChamps.app.removeUrl();
	},
	
	onItemInfoShow: function() {
		this.getTitleBarBackBtn().setText(LoLChamps.app.ITEMS_TXT);
		this.getTitleBarBackBtn().show();
		this.getTitleBar().setTitle(LoLChamps.app.ITEM_SEL_TXT);
	},
	
	onItemInfoHide: function() {
		this.getTitleBarBackBtn().hide();
		this.getTitleBar().setTitle(LoLChamps.app.ITEMS_TXT);
	},
	
	onRefreshBtnTap: function() {
		//TODO ADD CHAMP INFO VIEW?
		if (LoLChamps.app.getCurrentView() == 'champlistview') {
			Ext.getStore('champliststore').load({
				callback: function(records, operation, success) {
					if (success) {
						LoLChamps.app.getController('LoLChamps.controller.ChampController').createChampList();
					}
				}
			});
		}
		else if(LoLChamps.app.getCurrentView() == 'itemlistview') {
			Ext.getStore('itemliststore').load({
				callback:function(records, operation, success) {
					if(success) {
						LoLChamps.app.getController('LoLChamps.controller.ItemListController').createItemList();
					}
				}
			});
		}
		else if(LoLChamps.app.getCurrentView() == 'iteminfoview') {
			var currItem = LoLChamps.app.getController('ItemListController').retrieveItem(Ext.getStore('itemliststore').getData().all, LoLChamps.app.ITEM_ID);
			Ext.getStore('itemliststore').load({
				callback: function(records, operation, success) {
					if(success) { 
						LoLChamps.app.getController('ItemListController').setupItemInfoView(currItem);
					}
				}
			});
		}
		else if(LoLChamps.app.getCurrentView() == 'summonerinfoview') {
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
		}
		else if(LoLChamps.app.getCurrentView() == 'summonertapview') {
			if(!Ext.getCmp('summonerstats')) {
				Ext.getStore('summoneridstore').load({
					callback: function(records, operation, success) {
						if(success) {
							LoLChamps.app.resetRoute(LoLChamps.app.summonerRoute);
							LoLChamps.app.setUrl('summonerinfoview');
							LoLChamps.app.getController('LoLChamps.controller.SummonerController').createSummoner();
						}
						else {
							LoLChamps.app.resetRoute(LoLChamps.app.summonerRoute);
							LoLChamps.app.setUrl('summonerinfoview');
						}
					}
				});
			}
		}
	},
	
	onSummonerTapShow: function() {
		this.getTitleBarBackBtn().setText(LoLChamps.app.SUMMONER_TXT);
		this.getTitleBarBackBtn().show();
		this.getTitleBar().setTitle(LoLChamps.app.MODE_TXT)
	},
	
	onSummonerTapHide: function() {
		this.getTitleBarBackBtn().hide();
		this.getTitleBar().setTitle(LoLChamps.app.SUMMONER_TXT);
	},
	
	onSettingsBtnTap: function(button, e, eOpts) {
		if (!this.getSettingsView().isHidden()) {
			this.getSettingsView().hide();
			return;
		}
		
		this.OLD_LOCALE = LoLChamps.app.LOCALE;
		this.OLD_REGION = LoLChamps.app.REGION;
		this.getSettingsView().setModal(true);
		this.getSettingsView().setHideOnMaskTap(true);
		this.getSettingsView().showBy(button);
		
	},
	
	onSeasonChange: function(newValue, oldValue, eOpts) {
		LoLChamps.app.SEASON = newValue.getValue();
	},
	
	onLocaleChange: function(newValue, oldValue, eOpts) {
		LoLChamps.app.LOCALE = newValue.getValue();
	},
	
	onRegionChange: function(newValue, oldValue, eOpts) {
		LoLChamps.app.REGION = newValue.getValue();
	},
	
	onSettingsRefresh: function(eOpts) {
		if(this.OLD_LOCALE != LoLChamps.app.LOCALE || this.OLD_REGION != LoLChamps.app.REGION) {
			this.onRefreshBtnTap();
		}
	}
});
