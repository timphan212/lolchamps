Ext.define('LoLChamps.controller.TitleBarController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List'
	],
	xtype: 'titlebarcontroller',
	config: {
		views: [
			'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView', 'item.ItemListView', 'item.ItemInfoView',
			'summoner.SummonerInfoView', 'summoner.SummonerTapView', 'Settings'
		],
		refs: {
			ChampListView: '#champlistview',
			ChampInfoView: '#champinfoview',
			TitleBar: '#loltitlebar',
			TitleBarBackBtn: '#titlebackbtn',
			ItemListView: '#itemlistview',
			ItemInfoView: '#iteminfoview',
			SettingsBtn: '#settingsbtn',
			SettingsView: '#settingsview',
			SettingsLocaleSel: '#settingsview #fieldselect #localeselect',
			SettingsRegionSel: '#settingsview #fieldselect #regionselect',
			SettingsSeasonSel: '#settingsview #fieldselect #seasonselect',
			SummonerInfoView: '#summonerinfoview',
			SummonerTapView: '#summonertapview'
		},
		control: {
			ChampListView: {
				show: 'onChampInfoHide'
			},
			ChampInfoView: {
				show: 'onChampInfoShow',
				hide: 'onChampInfoHide'
			},
			TitleBarBackBtn: {
				tap: 'onTitleBackBtnTap'
			},
			ItemListView: {
				show: 'onItemInfoHide'
			},
			ItemInfoView: {
				show: 'onItemInfoShow',
				hide: 'onItemInfoHide'
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
				mousedown: 'onSettingsMouseDown'
			},
			SummonerInfoView: {
				show: 'onSummonerTapHide'
			},
			SummonerTapView: {
				show: 'onSummonerTapShow',
				hide: 'onSummonerTapHide'
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
	
	onSummonerTapShow: function() {
		this.getTitleBarBackBtn().setText(LoLChamps.app.SUMMONER_TXT);
		this.getTitleBarBackBtn().show();
		this.getTitleBar().setTitle(LoLChamps.app.SUMMONER_NAME)
	},
	
	onSummonerTapHide: function() {
		this.getTitleBarBackBtn().hide();
		this.getTitleBar().setTitle(LoLChamps.app.SUMMONER_TXT);
	},
	
	onSettingsBtnTap: function(button, e, eOpts) {
		Ext.getCmp('settingsview').showBy(button);
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
	
	onSettingsMouseDown: function(e, eOpts) {
		console.log('hello');
	}
});