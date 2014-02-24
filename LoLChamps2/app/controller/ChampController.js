Ext.define('LoLChamps.controller.ChampController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List', 'Ext.Img'
	],
	xtype: 'champcontroller',
	config: {
		views: [
			'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView'
		],
		refs: {
			ChampListView: '#champlistview',
			ChampListPanel: '#champlistview #champlistpanel',
			ChampInfoView: '#champinfoview',
			TitleBar: '#loltitlebar'
		}
	},
	
	createChampSquare: function(name, text, width) {
		var square = {
				xtype: 'container',
				layout: 'vbox',
				items: [{
					xtype: 'image',
					width: width,
					height: width,
//					id: id + 'Square',
					style: {
						'background-image': 'url("resources/images/champions/' + name + '_Square_0.png")',
						'background-size': '100%'
					}
				}, {
					html: text,
					
				}]
			};
		return square;
	},
	
	createHBoxContainer: function() {
		return {
			xtype: 'container',
			layout: 'hbox',
			items: [],
//			style: {
//				'clear': 'both'
//			}
		}
	},
	
	updateChampPanel: function(width) {
		var champStoreData = Ext.getStore('champliststore').getData();
		var count = Ext.getStore('champliststore').getCount();
		var columns = Math.floor(Ext.Viewport.getWindowWidth() / width);
		var rows = Math.ceil(count / columns);
		var items = [];
		var container = this.createHBoxContainer();
		var rowItems = [];
		var name = ""
		for (var i = 0; i < count; i++) {
			name = champStoreData.getAt(i).get('name');
			container.items.push(this.createChampSquare(name, name, width));
			if (container.items.length % columns == 0 || i == (count-1)) {
				items.push(container);
				var container = {
					xtype: 'container',
					layout: 'hbox',
					items: []
				};
				container.items = [];
			}
		}
		var rows = {
			xtype: 'container',
			id: 'champpanel',
			layout: 'vbox',
			items: items
		}
		this.getChampListPanel().add(rows);
	},
	
	createChampList: function() {
		if (Ext.getCmp('champpanel')) {
			return;
		}
		
		// Create Grid of Champions
		this.updateChampPanel(80);
		
		// Create Basic List
//		var champlist = Ext.create('Ext.dataview.List', {
//			id: 'ChampList',
//			store: Ext.getStore('champliststore'),
//			itemTpl: '{name}',
//			height: '100%',
//			listeners: {
//				itemtap: function(list, index, target, record, e, eOpts) {
//					LoLChamps.app.CHAMPION_SEL_TXT = record.getData().name;
//					LoLChamps.app.CHAMPION_ID = record.getData().id;
//					LoLChamps.app.setUrl('champinfoview');
//					Ext.getStore('champinfostore').load({
//						callback: function(records, operation, success) {
//							if (success) {
//								Ext.getCmp('champinfoview').setHtml(this.getData().getAt(0).getData().lore);
//							}
//						}
//					});
//				}
//			}
//		});
//		this.getChampListPanel().add(champlist);
	}
});