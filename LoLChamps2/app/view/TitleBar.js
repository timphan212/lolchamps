Ext.define('LoLChamps.view.TitleBar', {
	extend: 'Ext.TitleBar',
	xtype: 'loltitlebar',
	id: 'loltitlebar',
	config: {
		docked: 'top',
		title: LoLChamps.app.CHAMPIONS_TXT,
		items: [{
			id: 'titlebackbtn',
			text: LoLChamps.app.CHAMPIONS_TXT,
			align: 'left',
			xtype: 'button',
			ui: 'back',
			hidden: true
		}, {
			id: 'settingsbtn',
			align: 'right',
			xtype: 'button',
			iconCls: 'settings',
			iconMask: true
		}]
	}
});