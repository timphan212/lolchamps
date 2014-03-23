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
		        	text: 'Champions',
		        	id: 'champlistbtn'
		        },
		        {
		        	iconCls: 'navButton',
		        	flex: 1,
		        	xtype: 'button',
		        	text: 'Items',
		        	id: 'iteminfobtn'
		        },
		        {
		        	iconCls: 'navButton',
		        	flex: 1,
		        	xtype: 'button',
		        	text: 'Summoners',
		        	id: 'summonerinfobtn'
		        }
		       ]
	}
});