Ext.define('LoLChamps.view.item.ItemListView', {
	extend: 'Ext.Container',
	requires: [
	    'Ext.form.FieldSet', 'Ext.field.Search', 'Ext.field.Select'
	],
	xtype: 'itemlistview',
	id: 'itemlistview',
	config: {
		layout: 'vbox',
		items: [{
			xtype: 'fieldset',
			layout: 'hbox',
			height: '48px',
			items: [{
				xtype: 'searchfield',
				itemId: 'itemlistsearch',
				placeHolder: LoLChamps.app.SEARCH,
				flex: '4',
				listeners: {
					keyup: function(field, e, eOpts) {
						if (Ext.getStore('itemliststore')) {
							Ext.getStore('itemliststore').clearFilter();
							var regex = new RegExp(this.getValue(), 'i');
							Ext.getStore('itemliststore').filter('name', regex);
						}
					}
				}
			}, {
					xtype: 'selectfield',
					itemId: 'itemtagselect',
					flex: '1',
					ui: 'action',
					options: [
					     {text: 'All', value: false}
					],
					listeners: {
						change: function(field, newValue, oldValue, eOpts) {
							
						}
					}
				}]
		}, {
			xtype: 'panel',
			itemId: 'itemlistpanel',
			flex: 1
		}]
	}
});