Ext.define('LoLChamps.controller.NavigationBarController', {
	extend: 'Ext.app.Controller',
	xtype: 'navbarcontroller',
	config: {
		views: [
		    'NavigationBar', 'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView'
		],
		refs: {
			ChampListBtn: '#champlistbtn',
			ChampListView: '#champlistview',
			TitleBar: '#loltitlebar'
		},
		control: {
			ChampListBtn: {
				tap: 'onChampListBtnTap'
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
					callback: function() {
						LoLChamps.app.getController('LoLChamps.controller.ChampListController').createChampList();
					}
				})
			}
		}
	}
});