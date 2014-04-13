Ext.define('LoLChamps.controller.ItemListController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List', 'Ext.Img'
	],
	xtype: 'itemlistcontroller',
	ITEM_SQUARE_WIDTH: 64,
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
	
	launch: function() {
		this.addTapEvents();
	},
	
	addTapEvents: function() {
		this.getItemListPanel().element.on({
			tap: this.onItemPanelTap
		});
		this.getItemInfoView().element.on({
			tap: this.onItemInfoTap
		});
	},
	
	getImageSrcPath: function(bool) {
		if(bool) {
			return 'http://ddragon.leagueoflegends.com/cdn/' + LoLChamps.app.VERSION + '/img/item/';
		}
		else {
			return 'resources/images/items/';
		}
	},
	
	onItemPanelTap: function(target, object, e, eOpts) {
		if (object.nodeName == 'IMG' || object.nodeName == 'OBJECT') {
			var id = object.name;
			LoLChamps.app.ITEM_ID = id;
			var currItem = LoLChamps.app.getController('ItemListController').retrieveItem(Ext.getStore('itemliststore').getData().all, id);
			Ext.getStore('itemliststore').load({
				callback: function(records, operation, success) {
					if(success) { 
						this.setupItemInfoView(currItem);
					}
				}, scope: LoLChamps.app.getController('ItemListController')
			});
		}
	},
	
	onItemInfoTap: function(target, object, e, eOpts) {
		if(object.nodeName == 'IMG' || object.nodeName == 'OBJECT') {
			if(object.name != 'blank' && object.name != 'line' && object.name != 'angle') {
				var id = object.name;
				LoLChamps.app.ITEM_ID = id;
				var currItem = LoLChamps.app.getController('ItemListController').retrieveItem(Ext.getStore('itemliststore').getData().all, id);
				Ext.getStore('itemliststore').load({
					callback: function(records, operation, success) {
						if(success) { 
							this.setupItemInfoView(currItem);
						}
					}, scope: LoLChamps.app.getController('ItemListController')
				});
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

		var html = '';
		for(var i = 0; i < count; i++) {
			var name = itemData.getAt(i).getData().name;
			var id = itemData.getAt(i).getData().id;
			
			if(this.BONETOOTH_GRID_SKIP.indexOf(id) != -1 || this.ENCHANTMENT_GRID_SKIP.indexOf(id) != -1) {
				continue;
			}	
		
			html += this.formatHtml(id, name, width, true, 6, 6);
		}

		this.getItemListPanel().setHtml(html);
		this.getItemListPanel().setMasked(false);
	},
	
	updateItemInfoPanel: function(currItem, width) {
		if (Ext.getCmp('itempanel')) {
			Ext.getCmp('itempanel').destroy();
		}
		if(currItem.into == null) {
			return '';
		}
		
		var count = currItem.into.length;
		var html = '<BR>';
		
		for (var i = 0; i < count; i++) {
			var id = currItem.into[i];
			var name = (this.retrieveItem(Ext.getStore('itemliststore').getData().all, id)).name;
			html += this.formatHtml(id, name, width, true, 6, 6);
		}
		
		return html;
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
		var indentArr = this.getIndentation(arr);
		var html = '';
		
		for (var i = 0; i < count; i++) {
			var id = arr[i];
			var name = (this.retrieveItem(Ext.getStore('itemliststore').getData().all, arr[i])).name;
			var prevIndent = indentArr[i-1];
			var currIndent = 1;
			var blankBool = this.getFormation(indentArr, i);
			
			while(currIndent <= indentArr[i] && i > 0) {
				if(currIndent == indentArr[i]) {
					html += this.formatHtml('angle', '', width, false, 0, 0);
				}
				else if(indentArr[i] - indentArr[i+1] >  1) {
					if(currIndent == indentArr[i+1]) {
						html += this.formatHtml('line', '', width, false, 0, 0);
					}
					else {
						html += this.formatHtml('blank', '', width, false, 0, 0);
					}
				}
				else if(blankBool == 0) {
					html += this.formatHtml('blank', '', width, false, 0, 0);
				}
				else if(blankBool > 0) {
					if(blankBool == currIndent) {
						html += this.formatHtml('line', '', width, false, 0, 0);
					}
					else {
						html += this.formatHtml('blank', '', width, false, 0, 0);
					}
				}
				else {
					html += this.formatHtml('line', '', width, false, 0, 0);
				}
				currIndent++;
			}
			
			html += this.formatHtml(id, name, width, true, 0, 0);
			html += '<BR>';
		}
		
		return html;
	},
	
	retrieveItem: function(arr, id) {
		for(var index in arr) {
			if(arr[index].getData().id == id) {
				return arr[index].getData();
			}
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
		var html = '';
		html += this.createItemTree(arr, this.ITEM_SQUARE_WIDTH);
		html += '<BR>' + currItem.description +
				'<BR><BR>Recipe Cost: ' + currItem.gold.base +
				'<BR>Total Cost: ' + currItem.gold.total +
				'<BR>Sell: ' + currItem.gold.sell;
		html += this.updateItemInfoPanel(currItem, this.ITEM_SQUARE_WIDTH);
		
		this.getItemInfoView().setHtml(html);
	},
	
	formatHtml: function(id, name, width, bool, marginL, marginR) {
		var html = '';
		html += '<span style="display: inline-block; margin-left: ' + marginL + 'px; margin-right:  ' + marginR + 'px; vertical-align: top">';
		html += '<img src="' + this.getImageSrcPath(bool) + id + '.png" width="' + width + '" height="' + width + '" alt="' + id + '" name="' + id + '"/>';
		html += '<p style="text-align: center; font-size: 60%; overflow:hidden; text-overflow: ellipsis; width:' + width + 'px">' + name + '</p>';
		html += '</span>';
		
		return html;
	}
});