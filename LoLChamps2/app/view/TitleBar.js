Ext.define('LoLChamps.view.TitleBar', {
	extend: 'Ext.TitleBar',
	xtype: 'loltitlebar',
	id: 'loltitlebar',
	config: {
		docked: 'top',
		title: 'Champions',
		items: [{
			id: 'titlebackbtn',
			text: 'Champions',
			align: 'left',
			xtype: 'button',
			ui: 'back',
			hidden: true
		}, {
			id: 'refreshbtn',
			iconCls: 'refresh',
			align: 'left',
			xtype: 'button'
		}, {
			id: 'settingsbtn',
			align: 'right',
			xtype: 'button',
			iconCls: 'settings',
			iconMask: true
		}]
	}
});