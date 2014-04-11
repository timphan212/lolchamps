Ext.define('LoLChamps.controller.ItemListController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List', 'Ext.Img'
	],
	xtype: 'itemlistcontroller',
	ITEM_SQUARE_WIDTH: 64,
	IMAGE_SRC_PATH: 'http://ddragon.leagueoflegends.com/cdn/4.5.4/img',
	BONETOOTH_GRID_SKIP: ['3167', '3168', '3169', '3171', '3175', '3406', '3407', '3408', '3409', '3410',
						  '3412', '3413', '3414', '3415', '3416', '3418', '3419', '3420', '3421', '3422'],
	ENCHANTMENT_GRID_SKIP: ['3250', '3251', '3252', '3253', '3254', '3255', '3256', '3257', '3258', '3259',
	                        '3260', '3261', '3262', '3263', '3264', '3265', '3266', '3267', '3268', '3269',
	                        '3270', '3271', '3272', '3273', '3274', '3275', '3276', '3277', '3278', '3279',
	                        '3280', '3281', '3282', '3283', '3284'],
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
					if(Ext.getStore('itemliststore')) {
						this.getItemListPanel().setMasked(true);
						Ext.getStore('itemliststore').clearFilter();
						this.updateItemListPanel(this.ITEM_SQUARE_WIDTH);
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
		var items = [];
		var container = this.createHBoxContainer();

		var html = '';
		for(var i = 0; i < count; i++) {
			var name = itemData.getAt(i).getData().name;
			var id = itemData.getAt(i).getData().id;
			
			if(this.BONETOOTH_GRID_SKIP.indexOf(id) != -1 || this.ENCHANTMENT_GRID_SKIP.indexOf(id) != -1) {
				continue;
			}	
			
			html += '<span style="display: inline-block; margin-left: 6px; margin-right: 6px; vertical-align: top"><img src="' + this.IMAGE_SRC_PATH + '/item/' + id + '.png" width="' + width + '" height="' + width + '"/>';
			html += '<p style="text-align: center; font-size: 60%; overflow: true; width:' + width + 'px">' + name + '</p>';
			html += '</span>';
		}

		this.getItemListPanel().setHtml(html);
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
		var items = [];
		var container = this.createHBoxContainer();

		for (var i = 0; i < count; i++) {
			var id = currItem.into[i];
			var name = (this.retrieveItem(Ext.getStore('itemliststore').getData().all, id)).name;
			container.items.push(this.createItemSquare(id, name, width, id + '_info', false));
			
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
		var items = [];
		var container = this.createHBoxContainer();
		var indentArr = this.getIndentation(arr);
		var tabStr = '';
		
		for(var i = 0; i < 16; i++) {
			tabStr += '&nbsp;'
		}
		
		
		for (var i = 0; i < count; i++) {
			var id = arr[i];
			var name = (this.retrieveItem(Ext.getStore('itemliststore').getData().all, arr[i])).name;
			var prevIndent = indentArr[i-1];
			var currIndent = 1;
			var blankBool = this.getFormation(indentArr, i);
			
			while(currIndent <= indentArr[i] && i > 0) {
				if(currIndent == indentArr[i]) {
					container.items.push(this.createItemSquare('angle', tabStr, width, '', false));
				}
				else if(indentArr[i] - indentArr[i+1] >  1) {
					if(currIndent == indentArr[i+1]) {
						container.items.push(this.createItemSquare('line', tabStr, width, '', false));	
					}
					else {
						container.items.push(this.createItemSquare('blank', tabStr, width, '', false));
					}
				}
				else if(blankBool == 0) {
					container.items.push(this.createItemSquare('blank', tabStr, width, '', false));
				}
				else if(blankBool > 0) {
					if(blankBool == currIndent) {
						container.items.push(this.createItemSquare('line', tabStr, width, '', false));	
					}
					else {
						container.items.push(this.createItemSquare('blank', tabStr, width, '', false));
					}
				}
				else {
					console.log(name);
					console.log(blankBool);
					container.items.push(this.createItemSquare('line', tabStr, width, '', false));
				}
				currIndent++;
			}
			
			container.items.push(this.createItemSquare(id, name, width, '_tree_' + i, false));
			
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
	
	getFromItems: function(currItem, arr) {
		arr.push(currItem.id);
		if(currItem.from != null) {
			for(var i = 0; i < currItem.from.length; i++) {
				this.getFromItems(this.retrieveItem(Ext.getStore('itemliststore').getData().all, currItem.from[i]), arr);
			}
		}
		
		return arr;
	},
	
	getIndentation: function(arr) {
		var indentArr = [0];
		var indentCount = 0;
		var nestLevel = 1;
		var tempIndentCount = 0;
		
		for(var i= 1; i < arr.length; i++) {
			var currItem = this.retrieveItem(Ext.getStore('itemliststore').getData().all, arr[i]);
			indentArr[i] = 1;
			
			if(currItem.from == null) {
				if(indentCount > 0) {
					indentArr[i] += nestLevel;
					indentCount--;
					if(indentCount == 0) {
						nestLevel = 1;
					}
				}
				else if(tempIndentCount > 0) {
					indentArr[i] += nestLevel;
				}
			}
			else {
				if(indentCount > 0) {
					indentArr[i] += nestLevel;
					nestLevel++;
					indentCount--;
					if(indentCount > 0) {
						tempIndentCount = indentCount;
					}
				}
				indentCount = currItem.from.length;
			}
		}
		
		return indentArr;
	},
	
	getFormation: function(indentArr, index) {
		for(var i = index; i < indentArr.length; i++) {
			if(indentArr[index] > indentArr[i]) {
				return indentArr[i];
			}
		}
		
		return 0;
	},
	
	setupItemInfoView: function(currItem) {
		LoLChamps.app.ITEM_SEL_TXT = currItem.name;
		LoLChamps.app.setUrl('iteminfoview');
		var arr = [];
		arr = this.getFromItems(currItem, arr);
		var itemTree = this.createItemTree(arr, this.ITEM_SQUARE_WIDTH);
		var itemInfo = Ext.getCmp('iteminfoview').child('#iteminfocontainer');
		var container = this.updateItemPanel(currItem, this.ITEM_SQUARE_WIDTH);
		
		if(itemTree != null) {
				Ext.getCmp('iteminfoview').child('#itemtreecontainer').add(itemTree);
		}
		if(currItem.description != null) {	
			itemInfo.setHtml('<BR>' + currItem.description +
				    '<BR><BR>Recipe Cost: ' + currItem.gold.base +
				    '<BR>Total Cost: ' + currItem.gold.total +
				    '<BR>Sell: ' + currItem.gold.sell);
		}
		if(container != null) {
			Ext.getCmp('iteminfoview').child('#itemintocontainer').add(container);
		}
	},
	
	createItemSquare: function(id, text, width, caseStr, hideObj) {
		var square = {
				xtype: 'container',
				layout: 'vbox',
				items: [{
					xtype: 'image',
					width: width,
					src: this.IMAGE_SRC_PATH + '/item/' + id + '.png',
					height: width,
					hidden: hideObj,
					id: caseStr,
					style: {
						//'background-image': 'url("resources/images/items/' + id + '.png")',
						'background-size': '95%',
						'margin-left': 'auto', 
						'margin-right': 'auto'
					},
					listeners: {
						tap: function(image, e, eOpts) {
							if(id != 'blank' && id != 'angle' && id != 'line') {
								LoLChamps.app.ITEM_ID = id;
								var currItem = LoLChamps.app.getController('ItemListController').retrieveItem(Ext.getStore('itemliststore').getData().all, id);
								Ext.getStore('itemliststore').load({
									callback: function(records, operation, success) {
										if(success) { 
											LoLChamps.app.getController('ItemListController').setupItemInfoView(currItem);
										}
									}
								})
							}
						},
						error: function(image, event) {
							image.setSrc('resources/images/items/' + id + '.png')
						}
					}
				}, {
					html: text,
					style: {
						'width': '64px',
						'font-size': '50%',
						'text-align': 'center',
						'overflow': 'true'
						
					}
				}]
			};
		
		return square;
	}
});