Ext.define('LoLChamps.view.summoner.SummonerInfoView', {
	extend: 'Ext.Panel',
	requires: [
	   	    'Ext.tab.Panel'
	   	],
	xtype: 'summonerinfoview',
	id: 'summonerinfoview',
	config: {
		layout: 'vbox',
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
	        	flex: '1',
	        	xtype: 'button',
	        	id: 'summonersubmit'
			}
			]}, {
			xtype: 'tabpanel',
			itemId: 'summonertabpanel',
			flex: '1',
			items: [{
				title: 'Summary',
				itemId: 'summonerstats',
				xtype: 'list'
			}, {
				title: 'Ranked',
				itemId: 'summonerranked',
				xtype: 'list'
					
			}]
		}
		]
	}
});