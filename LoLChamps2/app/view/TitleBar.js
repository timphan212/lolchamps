Ext.define('LoLChamps.view.TitleBar', {
	extend: 'Ext.TitleBar',
	xtype: 'loltitlebar',
	id: 'loltitlebar',
	config: {
		docked: 'top',
		title: 'Champions',
		items: [{
			align: 'left',
			xtype: 'button',
			ui: 'back',
			hidden: true
		}]
	}
});