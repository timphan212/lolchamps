Ext.define('LoLChamps.view.summoner.SummonerInfoView', {
	extend: 'Ext.Panel',
	xtype: 'summonerinfoview',
	id: 'summonerinfoview',
	config: {
		layout: 'vbox',
		scrollable: 'vertical',
		hidden: true,
		items: [{
			xtype: 'container',
			itemId: 'summoneridcontainer'
		}]
	}
});