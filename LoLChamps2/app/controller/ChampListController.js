Ext.define('LoLChamps.controller.ChampListController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List'
	],
	xtype: 'champlistcontroller',
	config: {
		views: [
			'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView'
		],
		refs: {
			ChampListView: '#champlistview',
			ChampInfoView: '#champinfoview',
			TitleBar: '#loltitlebar'
		},
		routes: {
			'champlistview': 'redirectTo',
			'champinfoview': 'redirectTo'
		}
	},
	
	redirectTo: function() {
		LoLChamps.app.removeUrl();
	},
	
	createChampList: function() {
		if (Ext.getCmp('ChampList')) {
			return;
//			Ext.getCmp('ChampList').destroy();
		}
		var champlist = Ext.create('Ext.dataview.List', {
			id: 'ChampList',
			store: Ext.getStore('champliststore'),
			itemTpl: '{name}',
			listeners: {
				itemtap: function(list, index, target, record, e, eOpts) {
					LoLChamps.app.CHAMPION_SEL_TXT = record.getData().name;
//					Ext.getCmp('loltitlebar').setTitle(LoLChamps.app.CHAMPION_SEL_TXT);
					LoLChamps.app.setUrl('champinfoview');
//					LoLChamps.app.showView('champinfoview');
				}
			}
		});
		this.getChampListView().add(champlist);
	}
});