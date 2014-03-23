Ext.define('LoLChamps.view.champ.ChampInfoView', {
	extend: 'Ext.Panel',
	requires: [
	    'Ext.tab.Panel'
	],
	xtype: 'champinfoview',
	id: 'champinfoview',
	config: {
		layout: 'vbox',
		items: [{
			xtype: 'panel',
			itemId: 'champlogopanel'
		}, {
			xtype: 'tabpanel',
			itemId: 'champtabpanel',
			flex: 1,
			items: [{
				title: 'Stats',
				itemId: 'champstats',
				scrollable: 'vertical'
			}, {
				title: 'Spells',
				itemId: 'champspells',
				scrollable: 'vertical'
			}, {
				title: 'Lore',
				itemId: 'champlore',
				scrollable: 'vertical'
			}]
		}]
	}
});