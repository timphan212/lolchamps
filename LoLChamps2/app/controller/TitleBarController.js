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
			ChampInfoBackBtn: '#champinfoback',
			ItemListView: '#itemlistview',
			ItemInfoView: '#iteminfoview',
			ItemInfoBackBtn: '#iteminfoback'
		},
		control: {
			ChampListView: {
				show: 'onChampInfoHide'
			},
			ChampInfoView: {
				show: 'onChampInfoShow',
				hide: 'onChampInfoHide'
			},
			ChampInfoBackBtn: {
				tap: 'onChampBackBtnTap'
			},
			ItemListView: {
				show: 'onItemInfoHide'
			},
			ItemInfoView: {
				show: 'onItemInfoShow',
				hide: 'onItemInfoHide'
			},
			ItemInfoBackBtn: {
				tap: 'onChampBackBtnTap'
			}
		}
	},
	
	onChampInfoShow: function() {
		this.getChampInfoBackBtn().show();
		this.getTitleBar().setTitle(LoLChamps.app.CHAMPION_SEL_TXT);
	},
	
	onChampInfoHide: function() {
		this.getChampInfoBackBtn().hide();
		this.getTitleBar().setTitle(LoLChamps.app.CHAMPIONS_TXT);
	},
	
	onChampBackBtnTap: function() {
		LoLChamps.app.showView('champlistview');
		LoLChamps.app.removeUrl();
	},
	
	onItemInfoShow: function() {
		this.getItemInfoBackBtn().show();
		this.getTitleBar().setTitle(LoLChamps.app.ITEM_SEL_TXT);
	},
	
	onItemInfoHide: function() {
		this.getItemInfoBackBtn().hide();
		this.getTitleBar().setTitle(LoLChamps.app.ITEMS_TXT);
	},
	
	onItemBackBtnTap: function() {
		LoLChamps.app.showView('itemlistview');
		LoLChamps.app.removeUrl();
	}
});