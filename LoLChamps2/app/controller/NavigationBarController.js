Ext.define('LoLChamps.controller.NavigationBarController', {
	extend: 'Ext.app.Controller',
	xtype: 'navbarcontroller',
	config: {
		views: [
		    'NavigationBar', 'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView', 'item.ItemListView', 'item.ItemInfoView'
		],
		refs: {
			ChampListBtn: '#champlistbtn',
			ChampListView: '#champlistview',
			ItemInfoBtn: '#iteminfobtn',
			ItemListView: '#itemlistview',
			TitleBar: '#loltitlebar'
		},
		control: {
			ChampListBtn: {
				tap: 'onChampListBtnTap'
			},
			ItemInfoBtn: {
				tap: 'onItemListBtnTap'
			}
		},
		routes: {}
	},
	
	onChampListBtnTap: function(me, e, eOpts) {
		LoLChamps.app.resetRoute(LoLChamps.app.champRoute);
		LoLChamps.app.setUrl(LoLChamps.app.champRoute);
		if (LoLChamps.app.champRoute == 'champlistview') {
			if (!Ext.getCmp('ChampList')) {
				Ext.getStore('champliststore').load({
					callback: function(records, operation, success) {
						if (success) {
							LoLChamps.app.getController('LoLChamps.controller.ChampListController').createChampList();
						}
					}
				})
			}
		}
	},
	
	onItemListBtnTap: function(me, e, eOpts) {
		LoLChamps.app.resetRoute(LoLChamps.app.itemRoute);
		LoLChamps.app.setUrl(LoLChamps.app.itemRoute);
		if(LoLChamps.app.itemRoute == 'itemlistview') {
			if(!Ext.getCmp('ItemList')) {
				Ext.getStore('itemliststore').load({
					callback: function(records, operation, success) {
						if(success) {
							LoLChamps.app.getController('LoLChamps.controller.ItemListController').createItemList();
						}
					}
				})
			}
		}
	}
});