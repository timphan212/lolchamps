Ext.define('LoLChamps.view.summoner.SummonerTapView', {
	extend: 'Ext.Panel',
	requires: [
	   	    'Ext.tab.Panel'
	],
	xtype: 'summonertapview',
	id: 'summonertapview',
	config: {
		layout: 'vbox',
		scrollable: 'vertical',
		hidden: true,
		items: [{
			xtype: 'panel',
			itemId: 'summonertappanel'
		}]
	}
});