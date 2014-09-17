Ext.define('LoLChamps.view.NavigationBar', {
	extend: 'Ext.Panel',
	xtype: 'navigationbar',
	id: 'navigationbar',
	config: {
		//height: '48px',
		docked: 'bottom',
		layout: 'hbox',
		items: [
		        {
		        	flex: 1,
		        	xtype: 'button',
		        	id: 'champlistbtn',
		        	iconCls: 'champion'
		        },
		        {
		        	flex: 1,
		        	xtype: 'button',
		        	id: 'iteminfobtn',
		        	iconCls: 'coin'
		        },
		        {
		        	flex: 1,
		        	xtype: 'button',
		        	id: 'summonerinfobtn',
		        	iconCls: 'summoner'
		        }
		       ]
	}
});