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
				placeHolder: 'Search',
				flex: 1
			}]
		}, {
			xtype: 'panel',
			itemId: 'champlistpanel',
			flex: 1,
			scrollable: 'vertical'
		}]
	}
});