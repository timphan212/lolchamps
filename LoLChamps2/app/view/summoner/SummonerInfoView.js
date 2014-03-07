Ext.define('LoLChamps.view.summoner.SummonerInfoView', {
	extend: 'Ext.Panel',
	xtype: 'summonerinfoview',
	id: 'summonerinfoview',
	config: {
		layout: 'vbox',
		scrollable: 'vertical',
		hidden: true,
		items: [{
			xtype: 'fieldset',
			layout: 'hbox',
			height: '48px',
			items: [{
				xtype: 'textfield',
				id: 'summonertextfield',
				placeHolder: LoLChamps.app.ENTER_NAME,
				flex: '4',
			}, {
				iconCls: 'search',
	        	flex: 1,
	        	xtype: 'button',
	        	id: 'summonersubmit'
			}
			]}, {
			xtype: 'container',
			itemId: 'summoneridcontainer'
		}]
	}
});