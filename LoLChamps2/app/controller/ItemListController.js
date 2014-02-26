Ext.define('LoLChamps.controller.ItemListController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List', 'Ext.Img'
	],
	xtype: 'itemlistcontroller',
	ITEM_SQUARE_WIDTH: 80,
	config: {
		views: [
			'TitleBar', 'item.ItemListView', 'item.ItemInfoView'
		],
		refs: {
			ItemListView: '#itemlistview',
			ItemListPanel: '#itemlistview #itemlistpanel',
			ItemInfoView: '#iteminfoview',
			ItemInfoContainer: '#iteminfoview #iteminfocontainer',
			ItemIntoContainer: '#iteminfoview #itemintocontainer',
			SearchField: '#itemlistview #itemlistsearch',
			TagField: '#itemlistview #itemtagselect',
			TitleBar: '#loltitlebar'
		},
		control: {
			SearchField: {
				keyup: function(field, e, eOpts) {
					if (Ext.getStore('itemliststore')) {
						this.getItemListPanel().setMasked(true);
						Ext.getStore('itemliststore').clearFilter();
						var regex = new RegExp(field.getValue(), 'i');
						Ext.getStore('itemliststore').filter('name', regex);
						this.getItemListPanel().setMasked(false);
					}
				}
			},
			TagField: {
				change: function(field, newValue, oldValue, eOpts) {
					if(Ext.getStore('itemliststore')) {
						this.getItemListPanel().setMasked(true);
						if(field.getValue() === 'all') {
							Ext.getStore('itemliststore').clearFilter();
						}
						else {
							var itemStore = Ext.getStore('itemliststore').getData();
							var count = 0;
							var nameArr = [];
							Ext.getStore('itemliststore').clearFilter();
							while(itemStore.getAt(count) != null) {
								if(itemStore.getAt(count).getData().tags != null) {
									for(var i = 0; i < itemStore.getAt(count).getData().tags.length; i++) {
										if(itemStore.getAt(count).getData().tags[i] == field.getValue()) {
											nameArr.push(itemStore.getAt(count).getData().name);
										}
									}
								}
								count++;
							}
							Ext.getStore('itemliststore').filter(Ext.create('Ext.util.Filter', {
								filterFn: function(item) {
									return nameArr.some(function(name) { return name === item.get('name')});
					   				}
							}));
						}
						this.getItemListPanel().setMasked(false);
					}
				}
			}
		}
	},
	
	createItemList: function() {
		if (Ext.getCmp('ItemList')) {
			Ext.getCmp('ItemList').destroy();
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
					var container = LoLChamps.app.getController('ItemListController').updateItemPanel(currItem,
							LoLChamps.app.getController('ItemListController').ITEM_SQUARE_WIDTH);
					var itemInfo = Ext.getCmp('iteminfoview').child('#iteminfocontainer');
					
					if(currItem.plaintext != null) {	
						itemInfo.setHtml(currItem.plaintext +
							    '<BR><BR>' + currItem.description +
							    '<BR><BR>Recipe Cost: ' + currItem.gold.base +
							    '<BR>Total Cost: ' + currItem.gold.total +
							    '<BR>Sell: ' + currItem.gold.sell);
					}
					else if(currItem.id == '3250' || currItem.id == '3251' || currItem.id == '3252' ||
							currItem.id == '3253' || currItem.id == '3254') {
						itemInfo.setHtml(currItem.description +
							    '<BR><BR>Recipe Cost: ' + currItem.gold.base);
					}
					else {
						itemInfo.setHtml(currItem.description +
													    '<BR><BR>Recipe Cost: ' + currItem.gold.base +
													    '<BR>Total Cost: ' + currItem.gold.total +
													    '<BR>Sell: ' + currItem.gold.sell);

					}
					if(container != null) {
						Ext.getCmp('iteminfoview').child('#itemintocontainer').add(container);
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
		if(currItem.into == null) {
			return;
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
			var name = this.searchArr(Ext.getStore('itemliststore').getData().all, id);
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
	
	searchArr: function(arr, id) {
		for(var index in arr) {
			if(arr[index].getData().id == id) {
				return arr[index].getData().name;
			}
		}
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
				padding: 10,
				items: [{
					xtype: 'image',
					width: width,
					height: width,
					id: id,
					style: {
						'background-image': 'url("resources/images/items/' + id + '.png")',
						'background-size': '100%',
						'margin-left': 'auto',
						'margin-right': 'auto'
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
						'text-align': 'center'
					}
				}]
			};
		return square;
	}
});