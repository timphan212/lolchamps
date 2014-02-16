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
		        	xtype: 'button',
		        	text: LoLChamps.app.CHAMPIONS_TXT,
		        	id: 'champlistbtn'
		        }
		       ]
	}
});