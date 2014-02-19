Ext.define('LoLChamps.controller.ItemListController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List'
	],
	xtype: 'itemlistcontroller',
	config: {
		views: [
			'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView', 'item.ItemListView'
		],
		refs: {
			ChampListView: '#champlistview',
			ChampInfoView: '#champinfoview',
			ItemListView: '#itemlistview',
			TitleBar: '#loltitlebar'
		}
	},
	
	createItemList: function() {
		if (Ext.getCmp('ItemList')) {
			return;
		}
		
		/*var i = 0;
		var j = new Array();
		var funcs = [];
		var itemStore = Ext.getStore('itemliststore');
		console.log(itemStore.getData().getAt(0).getData().data);
		for(var itemObj in itemStore.getData().getAt(0).getData().data) {
			j[i] = itemObj;
			i++;
		}
		for(var itemID in j) {
			console.log(itemStore.getData().getAt(0).get('3089'));
		}
		LoLChamps.app.ITEM_ID = "3089";
		console.log(LoLChamps.app.ITEM_ID);
		Ext.getStore('itemidstore').load({
			callback: function(records, operation, success) {
				if (success) {
					console.log(this.getData().getAt(0).getData().name);
				}
			}
		});*/
		
		var itemlist = Ext.create('Ext.dataview.List', {
			id: 'ItemList',
			store: Ext.getStore('itemliststore'),
			itemTpl: '{name}'
		});
		console.log(itemlist);
		this.getItemListView().add(itemlist);
	}
});