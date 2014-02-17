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
					LoLChamps.app.CHAMPION_ID = record.getData().id;
					LoLChamps.app.setUrl('champinfoview');
					Ext.getStore('champinfostore').load({
						callback: function(records, operation, success) {
							if (success) {
								Ext.getCmp('champinfoview').setHtml(this.getData().getAt(0).getData().lore);
							}
						}
					});
				}
			}
		});
		this.getChampListView().add(champlist);
	}
});