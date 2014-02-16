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
		}
	},
	
	createChampList: function() {
		if (Ext.getCmp('ChampList')) {
			Ext.getCmp('ChampList').destroy();
		}
		var champlist = Ext.create('Ext.dataview.List', {
			id: 'ChampList',
			store: Ext.getStore('champliststore'),
			itemTpl: '{name}' 
		});
		this.getChampListView().add(champlist);
	}
});