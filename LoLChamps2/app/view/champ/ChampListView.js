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
				flex: '4'
			}, {
				xtype: 'selectfield',
				itemId: 'champlistf2pselect',
				flex: '1',
				ui: 'action',
				value: false,
				options: [
				     {text: 'All', value: false},
				     {text: 'F2P', value: true}
				]
			}]
		}, {
			xtype: 'panel',
			itemId: 'champlistpanel',
			flex: 1,
			scrollable: 'vertical'
		}]
	}
});