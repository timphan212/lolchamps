Ext.define('LoLChamps.controller.ChampController', {
	extend: 'Ext.app.Controller',
	requires: [
	    'Ext.dataview.List', 'Ext.Img'
	],
	xtype: 'champcontroller',
	
	CHAMPION_SQUARE_WIDTH: 80,
	
	config: {
		views: [
			'TitleBar', 'champ.ChampListView', 'champ.ChampInfoView'
		],
		refs: {
			ChampListView: '#champlistview',
			ChampListPanel: '#champlistview #champlistpanel',
			ChampInfoView: '#champinfoview',
			TitleBar: '#loltitlebar',
			SearchField: '#champlistview #champlistsearch',
			F2PField: '#champlistview #champlistf2pselect'
		},
		control: {
			SearchField: {
				keyup: function(field, e, eOpts) {
					if (Ext.getStore('champliststore')) {
						this.getChampListPanel().setMasked(true);
						Ext.getStore('champliststore').clearFilter();
						var regex = new RegExp(field.getValue(), 'i');
						Ext.getStore('champliststore').filter('displayName', regex);
						if (this.getF2PField().getValue()) {
							var regex2 = new RegExp(this.getF2PField().getValue(), 'i');
							Ext.getStore('champliststore').filter('freeToPlay', regex2);
						}
						this.updateChampPanel(this.CHAMPION_SQUARE_WIDTH);
						this.getChampListPanel().setMasked(false);
					}
					
				}
			},
			F2PField: {
				change: function(field, newValue, oldValue, eOpts) {
					if (Ext.getStore('champliststore')) {
						this.getChampListPanel().setMasked(true);
						Ext.getStore('champliststore').clearFilter();
						var regex = new RegExp(this.getSearchField().getValue(), 'i');
						Ext.getStore('champliststore').filter('displayName', regex);
						if (newValue) {
							var regex2 = new RegExp(newValue, 'i');
							Ext.getStore('champliststore').filter('freeToPlay', regex2);
						}
						this.updateChampPanel(this.CHAMPION_SQUARE_WIDTH);
						this.getChampListPanel().setMasked(false);
					}
					
				}
			}
		}
	},
	
	createChampSquare: function(id, text, width) {
		var square = {
				xtype: 'container',
				layout: 'vbox',
				items: [{
					xtype: 'image',
					width: width,
					height: width,
					id: text + '_' + id,
					style: {
						'background-image': 'url("resources/images/champions/' + text + '_Square_0.png")',
						'background-size': '100%'
					},
					listeners: {
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
					}
				}, {
					html: LoLChamps.app.DictionaryMapNames(text),
					style: {
						'font-size': '60%',
						'text-align': 'center'
					}
				}]
			};
		return square;
	},
	
	createHBoxContainer: function() {
		return {
			xtype: 'container',
			layout: 'hbox',
			items: []
		}
	},
	
	updateChampPanel: function(width) {
		if (Ext.getCmp('champpanel')) {
			Ext.getCmp('champpanel').destroy();
		}
		this.getChampListPanel().setMasked({
			xtype: 'loadmask',
			message: 'Filtering List'
		});
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
			container.items.push(this.createChampSquare(champStoreData.getAt(i).get('id'), name, width));
			if (container.items.length % columns == 0 || i == (count-1)) {
				items.push(container);
				var container = this.createHBoxContainer();
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
		this.getChampListPanel().setMasked(false);
	},
	
	createChampList: function() {
		if (Ext.getCmp('champpanel')) {
			return;
		}
		// Create Grid of Champions
		this.updateChampPanel(this.CHAMPION_SQUARE_WIDTH);
	}
});