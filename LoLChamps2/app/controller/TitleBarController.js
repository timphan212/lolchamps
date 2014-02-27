Ext.define('LoLChamps.controller.TitleBarController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List'
	],
	xtype: 'titlebarcontroller',
	config: {
		views: [
			'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView', 'item.ItemListView', 'item.ItemInfoView'
		],
		refs: {
			ChampListView: '#champlistview',
			ChampInfoView: '#champinfoview',
			TitleBar: '#loltitlebar',
			TitleBarBackBtn: '#titlebackbtn',
			ItemListView: '#itemlistview',
			ItemInfoView: '#iteminfoview',
			SettingsBtn: '#settingsbtn'
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
		this.getTitleBarBackBtn().setText(LoLChamps.app.ITEMS_TXT)
		this.getTitleBarBackBtn().show();
		this.getTitleBar().setTitle(LoLChamps.app.ITEM_SEL_TXT);
	},
	
	onItemInfoHide: function() {
		this.getTitleBarBackBtn().hide();
		this.getTitleBar().setTitle(LoLChamps.app.ITEMS_TXT);
	}
});