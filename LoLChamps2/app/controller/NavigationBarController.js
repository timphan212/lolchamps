Ext.define('LoLChamps.controller.NavigationBarController', {
	extend: 'Ext.app.Controller',
	xtype: 'navbarcontroller',
	config: {
		views: [
		    'NavigationBar', 'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView'
		],
		refs: {
			ChampListBtn: '#champlistbtn',
			ChampInfoBtn: '#champinfobtn',
			ChampListView: '#champlistview',
			TitleBar: '#loltitlebar'
		},
		control: {
			ChampListBtn: {
				tap: 'onChampListBtnTap'
			},
			ChampInfoBtn: {
				tap: 'onChampInfoBtnTap'
			}
		},
		routes: {}
	},
	
	onChampListBtnTap: function(me, e, eOpts) {
		this.getTitleBar().setTitle("Champions");
		Ext.getStore('champliststore').load({
			callback: function() {
				LoLChamps.app.getController('LoLChamps.controller.ChampListController').createChampList();
				Ext.Msg.alert('ChampListRequest', 'done');
			}
		})
	},
	
	onChampInfoBtnTap: function(me, e, eOpts) {
		
	},
	
	showView: function(view) {
//		var views = this.getViews();
//		for(var index in views) {
//			if (views[index] == )
//		}
	}
});