Ext.define('LoLChamps.view.item.ItemInfoView', {
	extend: 'Ext.Panel',
	xtype: 'iteminfoview',
	id: 'iteminfoview',
	config: {
		layout: 'vbox',
		scrollable: 'vertical',
		hidden: true,
		items: [{
			xtype: 'container',
			itemId: 'itemtreecontainer'
		}, {
			xtype: 'container',
			itemId: 'iteminfocontainer'
		}, {
			xtype: 'container',
			itemId: 'itemintocontainer'
		}]
	}
});