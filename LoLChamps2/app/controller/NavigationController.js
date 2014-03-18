Ext.define('LoLChamps.controller.NavigationController', {
	extend: 'Ext.app.Controller',
	xtype: 'navigationcontroller',
	config: {
		views: [
		    'NavigationBar', 'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView', 'item.ItemListView', 'item.ItemInfoView',
		    'summoner.SummonerInfoView', 'summoner.SummonerTapView'
		],
		refs: {
			ChampListBtn: '#champlistbtn',
			ChampListView: '#champlistview',
			ItemInfoBtn: '#iteminfobtn',
			ItemListView: '#itemlistview',
			SummonerInfoView: '#summonerinfoview',
			SummonerInfoBtn: '#summonerinfobtn',
			SummonerTapView: '#summonertapview',
			TitleBar: '#loltitlebar'
		},
		control: {
			ChampListBtn: {
				tap: 'onChampListBtnTap'
			},
			ItemInfoBtn: {
				tap: 'onItemListBtnTap'
			},
			SummonerInfoBtn: {
				tap: 'onSummonerBtnTap'
			}
		},
		routes: {
			'champlistview': 'redirectTo',
			'champinfoview': 'redirectTo',
			'itemlistview': 'redirectTo',
			'iteminfoview': 'redirectTo',
			'summonerinfoview': 'redirectTo',
			'summonertapview': 'redirectTo'
		}
	},
	
	redirectTo: function() {
		LoLChamps.app.removeUrl();
	},
	
	onChampListBtnTap: function(me, e, eOpts) {
		LoLChamps.app.resetRoute(LoLChamps.app.champRoute);
		LoLChamps.app.setUrl(LoLChamps.app.champRoute);
		if (LoLChamps.app.champRoute == 'champlistview') {
			if (Ext.getCmp('ChampList')) {
				Ext.getCmp('ChampList').destroy();
			}
			if (this.getChampListBtn().tappedTime) {
				if (new Date() - this.getChampListBtn().tappedTime < 1500) {
					return;
				}
			}
			this.getChampListBtn().tappedTime = new Date();
			Ext.getStore('champliststore').load({
				callback: function(records, operation, success) {
					if (success) {
						LoLChamps.app.getController('LoLChamps.controller.ChampController').createChampList();
					}
				}
			})
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
	},
	
	onSummonerBtnTap: function(me, e, eOpts) {
		LoLChamps.app.resetRoute(LoLChamps.app.summonerRoute);
		LoLChamps.app.setUrl(LoLChamps.app.summonerRoute);
	}
});