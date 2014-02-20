Ext.define('LoLChamps.controller.ItemListController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List'
	],
	xtype: 'itemlistcontroller',
	config: {
		views: [
			'TitleBar', 'item.ItemListView', 'item.ItemInfoView'
		],
		refs: {
			ItemListView: '#itemlistview',
			ItemInfoView: '#iteminfoview',
			TitleBar: '#loltitlebar'
		},
		routes: {
			'itemlistview': 'redirectTo',
			'iteminfoview': 'redirectTo'
		}
	},
	
	redirectTo: function() {
		LoLChamps.app.removeURL();
	},
	
	createItemList: function() {
		if (Ext.getCmp('ItemList')) {
			return;
		}
		
		var itemlist = Ext.create('Ext.dataview.List', {
			id: 'ItemList',
			store: Ext.getStore('itemliststore'),
			itemTpl: '{name}',
			listeners: {
				itemtap: function(list, index, target, record, e, eOpts) {
					LoLChamps.app.ITEM_SEL_TXT = record.getData().name;
					LoLChamps.app.ITEM_ID = record.getData().id;
					LoLChamps.app.setUrl('iteminfoview');
					Ext.getCmp('iteminfoview').setHtml(record.getData().name + ': ' + record.getData().description);
				}
			}
		});

		this.getItemListView().add(itemlist);
	}
});