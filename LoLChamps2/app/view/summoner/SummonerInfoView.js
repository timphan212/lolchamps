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
	        	flex: 1,
	        	xtype: 'button',
	        	id: 'summonersubmit'
			}
			]}, {
			xtype: 'tabpanel',
			itemId: 'summonertabpanel',
			flex: 1,
			items: [{
				title: 'Summoner Stats',
				itemId: 'summonerstats',
				scrollable: 'vertical',
				items: [{
					xtype: 'container',
					itemId: 'summonerid'
				}, {
					xtype: 'container',
					itemId: 'summonersummary'
				}]
			}, {
				title: 'Ranked Stats',
				itemId: 'summonerranked',
				scrollable: 'vertical'
			}, {
				title: 'Recent Games',
				itemId: 'summonerrecent',
				scrollable: 'vertical'
			}]
		}
		]
	}
});