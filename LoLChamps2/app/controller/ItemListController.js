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
			ItemListPanel: '#itemlistview #itemlistpanel',
			ItemInfoView: '#iteminfoview',
			TitleBar: '#loltitlebar'
		}
	},
	
	createItemList: function() {
		if (Ext.getCmp('ItemList')) {
			return;
		}
		
		var itemlist = Ext.create('Ext.dataview.List', {
			id: 'ItemList',
			store: Ext.getStore('itemliststore'),
			itemTpl: '{name}',
			height: '100%',
			listeners: {
				itemtap: function(list, index, target, record, e, eOpts) {
					LoLChamps.app.ITEM_SEL_TXT = record.getData().name;
					LoLChamps.app.ITEM_ID = record.getData().id;
					LoLChamps.app.setUrl('iteminfoview');
					Ext.getCmp('iteminfoview').setHtml(record.getData().plaintext +
													    '<BR><BR>' + record.getData().description +
													    '<BR><BR>Recipe Cost: ' + record.getData().gold.base +
													    '<BR>Total Cost: ' + record.getData().gold.total +
													    '<BR>Sell: ' + record.getData().gold.sell);
				}
			}
		});
		
		this.getItemListPanel().add(itemlist);
	}
});