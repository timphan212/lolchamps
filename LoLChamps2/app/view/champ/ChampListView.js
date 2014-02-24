Ext.define('LoLChamps.view.champ.ChampListView', {
	extend: 'Ext.Container',
	requires: [
	    'Ext.form.FieldSet', 'Ext.field.Search', 'Ext.field.Select'
	],
	xtype: 'champlistview',
	id: 'champlistview',
	config: {
		layout: 'vbox',
		items: [{
			xtype: 'fieldset',
			layout: 'hbox',
			height: '48px',
			items: [{
				xtype: 'searchfield',
				itemId: 'champlistsearch',
				placeHolder: LoLChamps.app.SEARCH,
				flex: '4',
				listeners: {
//					keyup: function(field, e, eOpts) {
//						if (Ext.getStore('champliststore')) {
//							Ext.getStore('champliststore').clearFilter();
//							var regex = new RegExp(this.getValue(), 'i');
//							Ext.getStore('champliststore').filter('name', regex);
//						}
//					}
				}
			}, {
				xtype: 'selectfield',
				itemId: 'champlistf2pselect',
				flex: '1',
				ui: 'action',
				options: [
				     {text: 'All', value: false},
				     {text: 'F2P', value: true}
				],
				listeners: {
					change: function(field, newValue, oldValue, eOpts) {
						
					}
				}
			}]
		}, {
			xtype: 'panel',
			itemId: 'champlistpanel',
			flex: 1,
			scrollable: 'vertical'
		}]
	}
});