Ext.define('LoLChamps.controller.ItemListController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List', 'Ext.Img'
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
					var currItem = record.getData();
					LoLChamps.app.ITEM_SEL_TXT = currItem.name;
					LoLChamps.app.ITEM_ID = currItem.id;
					LoLChamps.app.setUrl('iteminfoview');
					var container = LoLChamps.app.getController('ItemListController').updateItemPanel(currItem, 80);
					var test = Ext.getCmp('iteminfoview');
					for(var i = 0; i < currItem.into.length; i++) {
						
					}
					if(currItem.plaintext != null) {
						test.setHtml(currItem.plaintext +
							    '<BR><BR>' + currItem.description +
							    '<BR><BR>Recipe Cost: ' + currItem.gold.base +
							    '<BR>Total Cost: ' + currItem.gold.total +
							    '<BR>Sell: ' + currItem.gold.sell);
						test.add(container);
					}
					else if(currItem.id == '3250' || currItem.id == '3251' || currItem.id == '3252' ||
							currItem.id == '3253' || currItem.id == '3254') {
						Ext.getCmp('iteminfoview').setHtml(currItem.description +
							    '<BR><BR>Recipe Cost: ' + currItem.gold.base);
					}
					else {
						Ext.getCmp('iteminfoview').setHtml(currItem.description +
													    '<BR><BR>Recipe Cost: ' + currItem.gold.base +
													    '<BR>Total Cost: ' + currItem.gold.total +
													    '<BR>Sell: ' + currItem.gold.sell);

					}
				}
			}
		});
		
		this.getItemListPanel().add(itemlist);
	},
	
	updateItemPanel: function(currItem, width) {
		if (Ext.getCmp('itempanel')) {
			Ext.getCmp('itempanel').destroy();
		}
		var count = currItem.into.length;
		var columns = Math.floor(Ext.Viewport.getWindowWidth() / width);
		var rows = Math.ceil(count / columns);
		var items = [];
		var container = this.createHBoxContainer();
		var rowItems = [];
		var name = "";
		
		for (var i = 0; i < count; i++) {
			var id = currItem.into[i];
			var index = Ext.getStore('itemliststore').find('id', id);
			name = Ext.getStore('itemliststore').getData().getAt(index).getData().name;
			container.items.push(this.createItemSquare(id, name, width));
			
			if (container.items.length % columns == 0 || i == (count-1)) {
				items.push(container);
				var container = this.createHBoxContainer();
				container.items = [];
			}
		}
		
		var rows = {
			xtype: 'container',
			id: 'itempanel',
			layout: 'vbox',
			items: items
		}
		
		return rows;
	},
	
	createHBoxContainer: function() {
		return {
			xtype: 'container',
			layout: 'hbox',
			items: []
		}
	},
	
	createItemSquare: function(id, text, width) {
		var square = {
				xtype: 'container',
				layout: 'vbox',
				items: [{
					xtype: 'image',
					width: width,
					height: width,
					id: id,
					style: {
						'background-image': 'url("resources/images/items/' + id + '.png")',
						'background-size': '100%'
					},
					/*listeners: {
						tap: function(image, e, eOpts) {
							var strID = image.getId();
							var tokenIndex = strID.search('_');
							LoLChamps.app.CHAMPION_SEL_TXT = strID.substring(0,tokenIndex);
							LoLChamps.app.CHAMPION_ID = parseInt(strID.substring(tokenIndex+1));
							LoLChamps.app.setUrl('champinfoview');
							Ext.getStore('champinfostore').load({
								callback: function(records, operation, success) {
									if (success) {
										Ext.getCmp('champinfoview').setHtml(this.getData().getAt(0).getData().lore);
									}
								}
							});
						}
					}*/
				}, {
					html: text,
					style: {
						'font-size': '60%',
					}
				}]
			};
		return square;
	}
});