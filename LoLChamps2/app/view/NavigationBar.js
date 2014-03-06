Ext.define('LoLChamps.view.NavigationBar', {
	extend: 'Ext.Panel',
	xtype: 'navigationbar',
	id: 'navigationbar',
	config: {
		height: '60px',
		docked: 'bottom',
		layout: 'hbox',
		items: [
		        {
		        	iconCls: 'navButton',
		        	flex: 1,
		        	xtype: 'button',
		        	text: LoLChamps.app.CHAMPIONS_TXT,
		        	id: 'champlistbtn'
		        },
		        {
		        	iconCls: 'navButton',
		        	flex: 1,
		        	xtype: 'button',
		        	text: LoLChamps.app.ITEMS_TXT,
		        	id: 'iteminfobtn'
		        },
		        {
		        	iconCls: 'navButton',
		        	flex: 1,
		        	xtype: 'button',
		        	text: LoLChamps.app.SUMMONER_TXT,
		        	id: 'summonerinfobtn'
		        }
		       ]
	}
});