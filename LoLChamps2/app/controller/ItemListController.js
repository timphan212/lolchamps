Ext.define('LoLChamps.controller.ItemListController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List', 'Ext.Img'
	],
	xtype: 'itemlistcontroller',
	ITEM_SQUARE_WIDTH: 64,
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
						this.updateItemListPanel(this.ITEM_SQUARE_WIDTH);
						this.getItemListPanel().setMasked(false);
					}
				},
				clearicontap: function(e, eOpts) {
					Ext.getStore('itemliststore').clearFilter();
					this.updateItemListPanel(this.ITEM_SQUARE_WIDTH);
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
						this.updateItemListPanel(this.ITEM_SQUARE_WIDTH);
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
		
		this.updateItemListPanel(this.ITEM_SQUARE_WIDTH);
	},
	
	updateItemListPanel: function(width) {
		if(Ext.getCmp('itemlistpanel')) {
			Ext.getCmp('itemlistpanel').destroy();
		}
		this.getItemListPanel().setMasked({
			xtype: 'loadmask',
			message: 'Filtering List'
		});
		
		var itemData = Ext.getStore('itemliststore').getData();
		var count = Ext.getStore('itemliststore').getCount();
		var columns = Math.floor(Ext.Viewport.getWindowWidth() / width);
		var rows = Math.ceil(count / columns);
		var items = [];
		var container = this.createHBoxContainer();
		var rowItems = [];
		var name = "";
		
		for(var i = 0; i < count; i++) {
			var name = this.formatName(itemData.getAt(i).getData().name);
			var id = itemData.getAt(i).getData().id;
			container.items.push(this.createItemSquare(id, name, width, '_list'));
			
			if (container.items.length % columns == 0 || i == (count-1)) {
				items.push(container);
				var container = this.createHBoxContainer();
				container.items = [];
			}
		}
		
		var rows = {
				xtype: 'container',
				id: 'itemlistpanel',
				layout: 'vbox',
				items: items
		}
		
		this.getItemListPanel().add(rows);
		this.getItemListPanel().setMasked(false);
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
			var name = this.formatName((this.retrieveItem(Ext.getStore('itemliststore').getData().all, id)).name);
			container.items.push(this.createItemSquare(id, name, width, '_info'));
			
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
	
	createItemTree: function(arr, width) {
		if (Ext.getCmp('itemtreepanel')) {
			Ext.getCmp('itemtreepanel').destroy();
		}
		if(arr.length == 0) {
			return;
		}
		
		var count = arr.length;
		var columns = 1;
		var rows = Math.ceil(count / columns);
		var items = [];
		var container = this.createHBoxContainer();
		var rowItems = [];
		var name = "";

		for (var i = 0; i < count; i++) {
			var id = arr[i];
			var name = this.formatName((this.retrieveItem(Ext.getStore('itemliststore').getData().all, arr[i])).name);
			container.items.push(this.createItemSquare(id, name, width, '_tree_' + i));
			
			if (container.items.length % columns == 0 || i == (count-1)) {
				items.push(container);
				var container = this.createHBoxContainer();
				container.items = [];
			}
		}
		
		var rows = {
			xtype: 'container',
			id: 'itemtreepanel',
			layout: 'vbox',
			items: items
		}
		
		return rows;
	},
	
	retrieveItem: function(arr, id) {
		for(var index in arr) {
			if(arr[index].getData().id == id) {
				return arr[index].getData();
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
	
	formatName: function(name) {
		var nameArr = name.split(" ");
		var newName = nameArr[0];
		for(var i = 1; i < nameArr.length; i++) {
			if((newName + nameArr[i]).length > 9) {
				newName += "<BR>" + nameArr[i];
			}
			else {
				newName += " " + nameArr[i];
			}
		}
		
		return newName;
	},
	
	retrieveFromItems: function(currItem, arr) {
		arr.push(currItem.id);
		if(currItem.from != null) {
			for(var i = 0; i < currItem.from.length; i++) {
				this.retrieveFromItems(this.retrieveItem(Ext.getStore('itemliststore').getData().all, currItem.from[i]), arr);
			}
		}
		
		return arr;
	},
	
	setupItemInfoView: function(currItem) {
		LoLChamps.app.ITEM_SEL_TXT = currItem.name;
		LoLChamps.app.ITEM_ID = currItem.id;
		LoLChamps.app.setUrl('iteminfoview');
		var arr = [];
		arr = this.retrieveFromItems(currItem, arr);
		var itemTree = this.createItemTree(arr, this.ITEM_SQUARE_WIDTH);
		var itemInfo = Ext.getCmp('iteminfoview').child('#iteminfocontainer');
		var container = this.updateItemPanel(currItem, this.ITEM_SQUARE_WIDTH);
		
		if(itemTree != null) {
			Ext.getCmp('iteminfoview').child('#itemtreecontainer').add(itemTree);
		}
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
	},
	
	createItemSquare: function(id, text, width, caseStr) {
		var square = {
				xtype: 'container',
				layout: 'vbox',
				items: [{
					xtype: 'image',
					width: width,
					height: width,
					id: id + caseStr,
					style: {
						'background-image': 'url("resources/images/items/' + id + '.png")',
						'background-size': '95%',
						'margin-left': 'auto',
						'margin-right': 'auto'
					},
					listeners: {
						tap: function(image, e, eOpts) {
							var currItem = LoLChamps.app.getController('ItemListController').retrieveItem(Ext.getStore('itemliststore').getData().all, id);
							Ext.getStore('itemliststore').load({
								callback: function(records, operation, success) {
									if(success) { 
										LoLChamps.app.getController('ItemListController').setupItemInfoView(currItem);
									}
								}
							})
						}
					}
				}, {
					html: text,
					style: {
						'font-size': '50%',
						'text-align': 'center'
					}
				}]
			};
		
		return square;
	}
});